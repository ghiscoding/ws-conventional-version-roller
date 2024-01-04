import { describe, expect, it, vi } from 'vitest';

vi.mock('inquirer');

import npmlog from 'npmlog';
import inquirer from 'inquirer';

import { promptConfirmation, promptSelectOne, promptTextInput } from '../prompt';

describe('Prompt', () => {
  it('should prompt confirmation', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValue({ confirm: true });

    const logPauseSpy = vi.spyOn(npmlog, 'pause');
    const logResumeSpy = vi.spyOn(npmlog, 'resume');
    const inqSpy = vi.spyOn(inquirer, 'prompt');

    const output = await promptConfirmation('Choose something.');
    expect(logPauseSpy).toHaveBeenCalled();
    expect(logResumeSpy).toHaveBeenCalled();
    expect(inqSpy).toHaveBeenCalledWith([
      {
        type: 'expand',
        name: 'confirm',
        message: 'Choose something.',
        default: 2,
        choices: [
          { key: 'y', name: 'Yes', value: true },
          { key: 'n', name: 'No', value: false },
        ],
      },
    ]);
    expect(output).toBeTruthy();
  });

  it('should prompt confirmation return false', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValue({ confirm: false });

    const logPauseSpy = vi.spyOn(npmlog, 'pause');
    const logResumeSpy = vi.spyOn(npmlog, 'resume');
    const inqSpy = vi.spyOn(inquirer, 'prompt');

    const output = await promptConfirmation('Choose something.');
    expect(logPauseSpy).toHaveBeenCalled();
    expect(logResumeSpy).toHaveBeenCalled();
    expect(inqSpy).toHaveBeenCalled();
    expect(output).toBeFalsy();
  });

  it('should prompt confirmation', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValue({ confirm: true });

    const logPauseSpy = vi.spyOn(npmlog, 'pause');
    const logResumeSpy = vi.spyOn(npmlog, 'resume');
    const inqSpy = vi.spyOn(inquirer, 'prompt');

    const output = await promptConfirmation('Choose something.');
    expect(logPauseSpy).toHaveBeenCalled();
    expect(logResumeSpy).toHaveBeenCalled();
    expect(inqSpy).toHaveBeenCalled();
    expect(output).toBeTruthy();
  });

  it('should prompt confirmation return false', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValue({ confirm: false });

    const logPauseSpy = vi.spyOn(npmlog, 'pause');
    const logResumeSpy = vi.spyOn(npmlog, 'resume');
    const inqSpy = vi.spyOn(inquirer, 'prompt');

    const output = await promptConfirmation('Choose something.');
    expect(logPauseSpy).toHaveBeenCalled();
    expect(logResumeSpy).toHaveBeenCalled();
    expect(inqSpy).toHaveBeenCalled();
    expect(output).toBeFalsy();
  });

  it('should prompt select one', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValue({ prompt: true });

    const logPauseSpy = vi.spyOn(npmlog, 'pause');
    const logResumeSpy = vi.spyOn(npmlog, 'resume');
    const inqSpy = vi.spyOn(inquirer, 'prompt');

    const output = await promptSelectOne('Choose something.', {
      choices: [
        { value: 'patch', name: 'Patch' },
        { value: 'minor', name: 'Minor' },
        { value: 'major', name: 'Major' },
      ],
    });
    expect(logPauseSpy).toHaveBeenCalled();
    expect(logResumeSpy).toHaveBeenCalled();
    expect(inqSpy).toHaveBeenCalledWith([
      {
        choices: [
          {
            name: 'Patch',
            value: 'patch',
          },
          {
            name: 'Minor',
            value: 'minor',
          },
          {
            name: 'Major',
            value: 'major',
          },
        ],
        filter: undefined,
        message: 'Choose something.',
        name: 'prompt',
        pageSize: 3,
        type: 'list',
        validate: undefined,
      },
    ]);
    expect(output).toBeTruthy();
  });

  it('should prompt select one return false', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValue({ prompt: false });

    const logPauseSpy = vi.spyOn(npmlog, 'pause');
    const logResumeSpy = vi.spyOn(npmlog, 'resume');
    const inqSpy = vi.spyOn(inquirer, 'prompt');

    const output = await promptSelectOne('Choose something.', {
      choices: [
        { value: 'patch', name: 'Patch' },
        { value: 'minor', name: 'Minor' },
        { value: 'major', name: 'Major' },
      ],
    });
    expect(logPauseSpy).toHaveBeenCalled();
    expect(logResumeSpy).toHaveBeenCalled();
    expect(inqSpy).toHaveBeenCalled();
    expect(output).toBeFalsy();
  });

  it('should prompt text input', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValue({ input: true });

    const logPauseSpy = vi.spyOn(npmlog, 'pause');
    const logResumeSpy = vi.spyOn(npmlog, 'resume');
    const inqSpy = vi.spyOn(inquirer, 'prompt');

    const output = await promptTextInput('Choose something...', {
      filter: () => true,
      validate: () => false,
    });
    expect(logPauseSpy).toHaveBeenCalled();
    expect(logResumeSpy).toHaveBeenCalled();
    expect(inqSpy).toHaveBeenCalledWith([
      {
        filter: expect.any(Function),
        message: 'Choose something...',
        name: 'input',
        type: 'input',
        validate: expect.any(Function),
      },
    ]);
    expect(output).toBeTruthy();
  });

  it('should prompt text input return false', async () => {
    vi.spyOn(inquirer, 'prompt').mockResolvedValue({ input: false });

    const logPauseSpy = vi.spyOn(npmlog, 'pause');
    const logResumeSpy = vi.spyOn(npmlog, 'resume');
    const inqSpy = vi.spyOn(inquirer, 'prompt');

    const output = await promptTextInput('Choose something...', {
      filter: () => true,
      validate: () => false,
    });
    expect(logPauseSpy).toHaveBeenCalled();
    expect(logResumeSpy).toHaveBeenCalled();
    expect(inqSpy).toHaveBeenCalled();
    expect(output).toBeFalsy();
  });
});
