/*
 * @flow strict
 * Copyright (C) 2020 MetaBrainz Foundation
 *
 * This file is part of MusicBrainz, the open internet music database,
 * and is licensed under the GPL version 2, or (at your option) any
 * later version: http://www.gnu.org/licenses/gpl-2.0.txt
 */

import {ReleaseGroupListTable} from '../components/list/ReleaseGroupList.js';
import Layout from '../layout/index.js';
import sortByEntityName
  from '../static/scripts/common/utility/sortByEntityName.js';
import EnterEdit from '../static/scripts/edit/components/EnterEdit.js';
import EnterEditNote
  from '../static/scripts/edit/components/EnterEditNote.js';
import FieldErrors from '../static/scripts/edit/components/FieldErrors.js';

component ReleaseGroupMerge(
  form: MergeFormT,
  toMerge: $ReadOnlyArray<ReleaseGroupT>,
) {
  return (
    <Layout fullWidth title={l('Merge release groups')}>
      <div id="content">
        <h1>{l('Merge release groups')}</h1>
        <p>
          {l(`You are about to merge all these release groups into
              a single one. Please select the release group all others
              should be merged into:`)}
        </p>
        <form method="post">
          <ReleaseGroupListTable
            mergeForm={form}
            releaseGroups={sortByEntityName(toMerge)}
          />
          <FieldErrors field={form.field.target} />

          <EnterEditNote field={form.field.edit_note} />

          <EnterEdit form={form}>
            <button
              className="negative"
              name="submit"
              type="submit"
              value="cancel"
            >
              {l('Cancel')}
            </button>
          </EnterEdit>
        </form>
      </div>
    </Layout>
  );
}

export default ReleaseGroupMerge;
