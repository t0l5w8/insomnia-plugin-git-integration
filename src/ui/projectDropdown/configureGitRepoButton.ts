import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';

export default function configureGitRepoButton(projectDropdown: Element): HTMLElement {
  const configureProjectButton = document.createElement('li');
  configureProjectButton.className = 'sc-crXcEl dTKZde';
  configureProjectButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-cog">
        </i>
        Configure Git Repo
      </div>
    </div>
  `;
  configureProjectButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    const projectId = getActiveProjectId();

    if (projectId === 'proj_default-project' || !projectId) {
      // TODO: Better error message
      alert('Can not configure for default project create seperate')
      return;
    }

    // @ts-ignore
    const openResult = await window.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (openResult.canceled || openResult.filePaths.lenght === 0) {
      return;
    }

    const config = InternalDb.create();
    config.upsertProject(projectId, openResult.filePaths[0], '');
  });

  // Hover effect
  configureProjectButton.addEventListener('mouseover', () => {
    configureProjectButton.className = 'sc-crXcEl UvQbr';
  });
  configureProjectButton.addEventListener('mouseout', () => {
    configureProjectButton.className = 'sc-crXcEl dTKZde';
  });

  return configureProjectButton;
}
