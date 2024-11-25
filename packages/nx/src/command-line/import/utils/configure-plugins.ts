import { bold } from 'chalk';
import {
  checkCompatibleWithPlugins,
  updatePluginsInNxJson,
} from './check-compatible-with-plugins';
import { output } from '../../../utils/output';
import { PackageManagerCommands } from '../../../utils/package-manager';
import { GitRepository } from '../../../utils/git-utils';
import { installPlugins } from '../../init/init-v2';

/**
 * Configures plugins
 * @param repoRoot
 * @param plugins
 * @param updatePackageScripts
 * @param verbose
 * @returns
 */
export async function configurePlugins(
  repoRoot: string,
  plugins: string[],
  updatePackageScripts: boolean,
  pmc: PackageManagerCommands,
  destinationGitClient: GitRepository,
  verbose: boolean = false
): Promise<{
  succeededPlugins: string[];
  failedPlugins: { [plugin: string]: Error };
  incompatiblePlugins: { [plugin: string]: Set<string> };
}> {
  if (plugins.length === 0) {
    return;
  }

  let { succeededPlugins, failedPlugins } = await installPlugins(
    repoRoot,
    plugins,
    updatePackageScripts,
    verbose
  );

  let incompatiblePlugins: { [plugin: string]: Set<string> } = {};
  if (succeededPlugins.length > 0) {
    destinationGitClient.amendCommit();
    incompatiblePlugins = await checkCompatibleWithPlugins(
      succeededPlugins.map((plugin) => plugin + '/plugin'), // succeededPlugins are the package names, but we need the plugin names
      repoRoot
    );
    if (Object.keys(incompatiblePlugins).length > 0) {
      // Remove incompatible plugins from the list of succeeded plugins
      succeededPlugins = succeededPlugins.filter(
        (plugin) => !incompatiblePlugins[plugin + '/plugin']
      );
      if (succeededPlugins.length > 0) {
        output.success({
          title: 'Installed Plugins',
          bodyLines: succeededPlugins.map((p) => `- ${bold(p)}`),
        });
      }
      output.warn({
        title: `Imcompatible plugins found`,
        bodyLines: [
          'The following plugins were not compatible:',
          ...Object.keys(incompatiblePlugins).map((p) => `- ${bold(p)}`),
          `Please review the files and remove them from the exclude list if they are compatible with the plugin.`,
        ],
      });

      updatePluginsInNxJson(repoRoot, incompatiblePlugins);
      destinationGitClient.amendCommit();
    }
  }
  if (Object.keys(failedPlugins).length > 0) {
    output.error({
      title: `Failed to install plugins`,
      bodyLines: [
        'The following plugins were not installed:',
        ...Object.keys(failedPlugins).map((p) => `- ${bold(p)}`),
      ],
    });
    Object.entries(failedPlugins).forEach(([plugin, error]) => {
      output.error({
        title: `Failed to install ${plugin}`,
        bodyLines: [error.stack ?? error.message ?? error.toString()],
      });
    });
    output.error({
      title: `To install the plugins manually`,
      bodyLines: [
        'You may need to run commands to install the plugins:',
        ...Object.keys(failedPlugins).map(
          (p) => `- ${bold(pmc.exec + ' nx add ' + p)}`
        ),
      ],
    });
  }
  return { succeededPlugins, failedPlugins, incompatiblePlugins };
}
