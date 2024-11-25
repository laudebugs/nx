import type { Tree } from '@nx/devkit';
import type {
  NestGeneratorOptions,
  NormalizedOptions,
  UnitTestRunner,
} from './types';
import { determineArtifactNameAndDirectoryOptions } from '@nx/devkit/src/generators/artifact-name-and-directory-utils';

export async function normalizeOptions(
  tree: Tree,
  options: NestGeneratorOptions
): Promise<NormalizedOptions> {
  const { directory, fileName } =
    await determineArtifactNameAndDirectoryOptions(tree, {
      path: options.path,
    });

  return {
    ...options,
    name: fileName,
    // the nestjs schematics append the `path` to the `sourceRoot`, so we set
    // `sourceRoot` to an empty string and the `path` to the fully normalized
    // artifact path
    path: directory,
    sourceRoot: '',
    flat: true,
    skipFormat: options.skipFormat,
  };
}

export function unitTestRunnerToSpec(
  unitTestRunner: UnitTestRunner | undefined
): boolean | undefined {
  return unitTestRunner !== undefined ? unitTestRunner === 'jest' : undefined;
}
