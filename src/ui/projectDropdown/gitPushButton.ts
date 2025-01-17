import { SimpleGit } from 'simple-git';
import alertModal from '../react/alertModal';
import renderModal from '../react/renderModal';
import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';

export default function gitPushButton(projectDropdown: Element, gitClient: SimpleGit): HTMLElement {
  const gitPushButton = document.createElement('li');
  gitPushButton.className = 'ipgi-dropdown-btn-wrapper';
  gitPushButton.innerHTML = `
    <div role="button" class="ipgi-dropdown-btn">
      <div class="ipgi-dropdown-btn-text">
        <i class="ipgi-dropdown-btn-icon fa fa-code-pull-request">
        </i>
        Push
      </div>
    </div>
  `;
  gitPushButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    try {
      const branch = await gitClient.branchLocal();
      const remotes = await gitClient.getRemotes();
      if (!remotes[0]) {
        await renderModal(alertModal('Unable to push', 'No remotes defined for git repository'));
        return;
      }

      const projectId = getActiveProjectId();
      if (!projectId) {
        await renderModal(alertModal('Internal error', 'No ProjectId found in LocalStorage'));
        return;
      }

      const projectConfigDb = InternalDb.create();
      const projectConfig = projectConfigDb.getProject(projectId);

      const remote = projectConfig.remote ?? remotes[0].name;

      const pushResult = await gitClient.push(remote, branch.current);

      let message = `Pushed to ${remote}/${branch.current}.`;
      if (pushResult.update) {
        message += ` Remote is now at "${pushResult.update.hash.to}" (was at "${pushResult.update.hash.from}" before)`
      }

      await renderModal(alertModal('Pushed commits', message));
    } catch (error) {
      await renderModal(alertModal('Push failed', 'An error occurred while pushing commits', error));
    }
  });

  // This makes the hover effect work
  gitPushButton.addEventListener('mouseover', () => {
    gitPushButton.className = 'sc-crXcEl UvQbr';
  });
  gitPushButton.addEventListener('mouseout', () => {
    gitPushButton.className = 'sc-crXcEl dTKZde';
  });

  return gitPushButton;
}
