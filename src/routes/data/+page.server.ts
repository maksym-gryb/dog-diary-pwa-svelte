import type { PageServerLoad } from './$types';
import fs from 'node:fs/promises';
import path from 'node:path';

export const load: PageServerLoad = async () => {
  const filePath = path.resolve(
    'src/lib/data/dog-activities.json'
  );

  const fileContents = await fs.readFile(filePath, 'utf-8');
  const activities = JSON.parse(fileContents);

  return {
    activities
  };
};