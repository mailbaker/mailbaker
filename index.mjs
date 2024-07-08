#!/usr/bin/env node

import degit from 'degit';
import color from 'picocolors';
import * as p from '@clack/prompts';
import { installDependencies } from 'nypm';

export async function main() {
    console.clear();

    p.intro(`${color.bgCyan(color.black(' mailbaker '))}`);

    const project = await p.group(
        {
            path: () =>
                p.text({
                    message: 'Where should we create your project?',
                    placeholder: './mailbaker',
                    validate: value => {
                        if (!value) return 'Please enter a path.';
                        if (value[0] !== '.') return 'Please enter a relative path.';
                    },
                })
        },
        {
            onCancel: () => {
                p.cancel('💀');
                process.exit(0);
            },
        }
    );

    const spinner = p.spinner();

    /**
     * Clone the starter project.
     */
    spinner.start('Creating project');

    const emitter = degit('mailbaker/framework');

    await emitter.clone(project.path);

    spinner.stop(`Created project ${color.gray('in ' + project.path)}`);

    /**
     * Install dependencies
     */

    spinner.start('Installing dependencies');
    const startTime = Date.now();

    await installDependencies({
        cwd: project.path,
        silent: true,
        packageManager: 'npm',
    });

    spinner.stop(`Installed dependencies ${color.gray((Date.now() - startTime) / 1000 + 's')}`);

    let nextSteps = `cd ${project.path}\nnpm run dev`;

    p.note(nextSteps, 'Next steps:');

    process.exit(0);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});