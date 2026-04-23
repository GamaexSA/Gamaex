import { prisma } from "../src/index";
import bcrypt from "bcrypt";

async function main() {
  // Desactivar todos los usuarios existentes (admin@gamaex.cl, eduardo@gamaex.cl, etc.)
  const deactivated = await prisma.adminUser.updateMany({
    data: { is_active: false },
  });
  console.log(`✓ ${deactivated.count} usuario(s) anterior(es) desactivado(s)`);

  // Crear o actualizar Alan como único SUPER_ADMIN activo
  const passwordHash = await bcrypt.hash("Jacobo1452%", 12);

  await prisma.adminUser.upsert({
    where: { email: "alanschwarc7@gmail.com" },
    update: {
      password_hash: passwordHash,
      name: "Alan",
      role: "SUPER_ADMIN",
      is_active: true,
    },
    create: {
      email: "alanschwarc7@gmail.com",
      name: "Alan",
      password_hash: passwordHash,
      role: "SUPER_ADMIN",
      is_active: true,
    },
  });

  console.log("✓ Alan (alanschwarc7@gmail.com) configurado como SUPER_ADMIN activo");
  console.log("✓ Contraseña almacenada con bcrypt (cost 12)");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
