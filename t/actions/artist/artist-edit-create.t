use strict;
use warnings;

use Catalyst::Test 'MusicBrainz::Server';
use MusicBrainz::Server::Test qw( xml_ok );
use Test::More;
use Test::WWW::Mechanize::Catalyst;

my $mech = Test::WWW::Mechanize::Catalyst->new(catalyst_app => 'MusicBrainz::Server');
my ($res, $c) = ctx_request('/');

# Test creating new artists via the create artist form
$mech->get_ok('/login');
$mech->submit_form( with_fields => { username => 'new_editor', password => 'password' } );

subtest 'Create artists with all fields' => sub {
    $mech->get_ok('/artist/create');
    xml_ok($mech->content);
    my $response = $mech->submit_form(
        with_fields => {
            'edit-artist.name' => 'controller artist',
            'edit-artist.sort_name' => 'artist, controller',
            'edit-artist.type_id' => 1,
            'edit-artist.country_id' => 2,
            'edit-artist.gender_id' => 2,
            'edit-artist.begin_date.year' => 1990,
            'edit-artist.begin_date.month' => 01,
            'edit-artist.begin_date.day' => 02,
            'edit-artist.end_date.year' => 2003,
            'edit-artist.end_date.month' => 4,
            'edit-artist.end_date.day' => 15,
            'edit-artist.comment' => 'artist created in controller_artist.t',
        }
    );
    ok($mech->success);
    ok($mech->uri =~ qr{/artist/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})}, 'should redirect to artist page via gid');

    my $edit = MusicBrainz::Server::Test->get_latest_edit($c);
    isa_ok($edit, 'MusicBrainz::Server::Edit::Artist::Create');
    is_deeply($edit->data, {
        name => 'controller artist',
        sort_name => 'artist, controller',
        type_id => 1,
        country_id => 2,
        gender_id => 2,
        comment => 'artist created in controller_artist.t',
        begin_date => {
            year => 1990,
            month => 01,
            day => 02
        },
        end_date => {
            year => 2003,
            month => 4,
            day => 15
        },
    });


    # Test display of edit data
    $mech->get_ok('/edit/' . $edit->id, 'Fetch the edit page');
    xml_ok ($mech->content, '..xml is valid');
    $mech->content_contains ('controller artist', '.. contains artist name');
    $mech->content_contains ('artist, controller', '.. contains sort name');
    $mech->content_contains ('Person', '.. contains artist type');
    $mech->content_contains ('United States', '.. contains country');
    $mech->content_contains ('Female', '.. contains artist gender');
    $mech->content_contains ('artist created in controller_artist.t',
                             '.. contains artist comment');
    $mech->content_contains ('1990-01-02', '.. contains begin date');
    $mech->content_contains ('2003-04-15', '.. contains end date');

    done_testing;
};

subtest 'Creating artists with only the minimal amount of fields' => sub {
    $mech->get_ok('/artist/create');
    xml_ok($mech->content);
    my $response = $mech->submit_form(
        with_fields => {
            'edit-artist.name' => 'Alice Artist',
            'edit-artist.sort_name' => 'Artist, Alice',
            'edit-artist.type_id' => '',
            'edit-artist.country_id' => '',
            'edit-artist.gender_id' => '',
            'edit-artist.begin_date.year' => '',
            'edit-artist.begin_date.month' => '',
            'edit-artist.begin_date.day' => '',
            'edit-artist.end_date.year' => '',
            'edit-artist.end_date.month' => '',
            'edit-artist.end_date.day' => '',
            'edit-artist.comment' => '',
        }
    );
    ok($mech->success);
    ok($mech->uri =~ qr{/artist/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})}, 'should redirect to artist page via gid');

    my $edit = MusicBrainz::Server::Test->get_latest_edit($c);
    isa_ok($edit, 'MusicBrainz::Server::Edit::Artist::Create');
    is_deeply($edit->data, {
        name => 'Alice Artist',
        sort_name => 'Artist, Alice',
        type_id => undef,
        country_id => undef,
        gender_id => undef,
        comment => undef,
        begin_date => undef,
        end_date => undef,
    });


    # Test display of edit data
    $mech->get_ok('/edit/' . $edit->id, 'Fetch the edit page');
    xml_ok ($mech->content, '..xml is valid');
    $mech->content_contains ('Alice Artist', '.. contains artist name');
    $mech->content_contains ('Artist, Alice', '.. contains sort name');

    done_testing;
};

done_testing;
