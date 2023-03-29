import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';
import fs from 'node:fs';
import { exportProject } from '../../exportData';
import { join } from 'node:path';

export default function exportProjectButton(projectDropdown: Element): HTMLElement {
  const exportProjectButton = document.createElement('li');
  exportProjectButton.className = 'sc-crXcEl dTKZde';
  exportProjectButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-upload">
        </i>
        Export Project
      </div>
    </div>
  `;
  exportProjectButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    const projectId = getActiveProjectId();
    if (!projectId) {
      alert('INTERNAL ERROR: Not ProjectId in LocalStorage')
      return;
    }

    const config = InternalDb.create();
    const path = config.getProjectPath(projectId);
    if (!path || projectId === 'proj_default-project') {
      // TODO: Better error message
      alert('Project is not configured or default project')
      return;
    }

    const [projectData, workspaces] = await exportProject(projectId);

    const targetFile = join(path, 'project.json');
    fs.writeFileSync(targetFile, JSON.stringify(projectData, null, 2));

    for (const workspace of workspaces) {
      const targetFile = join(path, workspace.id + '.json');
      fs.writeFileSync(targetFile, JSON.stringify(workspace, null, 2));
    }
  });
  
  // This makes the hover effect work
  exportProjectButton.addEventListener('mouseover', () => {
    exportProjectButton.className = 'sc-crXcEl UvQbr';
  });
  exportProjectButton.addEventListener('mouseout', () => {
    exportProjectButton.className = 'sc-crXcEl dTKZde';
  });

  return exportProjectButton;
}
