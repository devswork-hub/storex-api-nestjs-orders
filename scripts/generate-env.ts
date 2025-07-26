import { writeFileSync } from 'fs';
import path from 'path';
import { ConfigSchema } from '../src/app/config/config.schema';

function generateEnvFromZod(schema: typeof ConfigSchema) {
  const shape = schema.shape;
  const lines: string[] = [];

  for (const key in shape) {
    const schemaField = shape[key as keyof typeof shape];

    // Tentamos obter um valor default se houver
    let defaultValue = '';

    try {
      // Use ._def.defaultValue() if available, otherwise parse undefined to get default
      if (typeof (schemaField as any)._def?.defaultValue === 'function') {
        defaultValue = String((schemaField as any)._def.defaultValue());
      } else {
        const parsed = (schemaField as any).safeParse(undefined);
        if (parsed.success && parsed.data !== undefined) {
          defaultValue = String(parsed.data);
        }
      }
    } catch (e) {
      // ignore if cannot get default
    }

    lines.push(`${key}=${defaultValue}`);
  }

  const outputPath = path.resolve(process.cwd(), '.env.generated');
  writeFileSync(outputPath, lines.join('\n'), 'utf-8');
  console.log(`✅ .env.generated criado com sucesso em: ${outputPath}`);
}

generateEnvFromZod(ConfigSchema);
