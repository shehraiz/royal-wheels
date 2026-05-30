import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient({ log: ["error"] });

const vehicles = [
  {
    name: "Toyota Corolla",
    slug: "toyota-corolla",
    category: "Sedan",
    seats: 5,
    pricePerDay: 7000,
    description:
      "Pakistan's most trusted sedan. Comfortable, fuel-efficient, and ideal for city travel or long routes. Includes a professional driver.",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileageLimitKmPerDay: 200,
    extraKmCharge: 15,
    outOfCitySurcharge: 1000,
  },
  {
    name: "Honda Civic",
    slug: "honda-civic",
    category: "Sedan",
    seats: 5,
    pricePerDay: 10000,
    description:
      "A premium sedan offering a refined driving experience. Spacious cabin, modern features, and a skilled driver for every journey.",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileageLimitKmPerDay: 200,
    extraKmCharge: 20,
    outOfCitySurcharge: 1500,
  },
  {
    name: "Toyota Hilux Vigo",
    slug: "toyota-hilux-vigo",
    category: "Pickup/4x4",
    seats: 5,
    pricePerDay: 8500,
    description:
      "Double cabin 4x4 pickup built for Pakistan's varied terrain. Perfect for northern trips, off-road adventure, or heavy-duty travel.",
    transmission: "Manual",
    fuelType: "Diesel",
    mileageLimitKmPerDay: 250,
    extraKmCharge: 18,
    outOfCitySurcharge: 1200,
  },
  {
    name: "Toyota Hilux Revo",
    slug: "toyota-hilux-revo",
    category: "Pickup/4x4",
    seats: 5,
    pricePerDay: 11500,
    description:
      "The newer-generation Hilux with enhanced features, better comfort, and powerful 4x4 capability. Ideal for northern Pakistan routes.",
    transmission: "Automatic",
    fuelType: "Diesel",
    mileageLimitKmPerDay: 250,
    extraKmCharge: 22,
    outOfCitySurcharge: 1500,
  },
  {
    name: "Toyota Fortuner",
    slug: "toyota-fortuner",
    category: "SUV",
    seats: 7,
    pricePerDay: 13500,
    description:
      "The go-to family SUV in Pakistan. Commanding presence, 7-seat capacity, and capable 4x4 drivetrain for any terrain.",
    transmission: "Automatic",
    fuelType: "Diesel",
    mileageLimitKmPerDay: 300,
    extraKmCharge: 25,
    outOfCitySurcharge: 2000,
  },
  {
    name: "Toyota Prado",
    slug: "toyota-prado",
    category: "SUV",
    seats: 7,
    pricePerDay: 15000,
    description:
      "Luxury meets capability. The Prado offers a premium cabin, superior off-road performance, and first-class comfort for discerning travellers.",
    transmission: "Automatic",
    fuelType: "Diesel",
    mileageLimitKmPerDay: 300,
    extraKmCharge: 30,
    outOfCitySurcharge: 2500,
  },
  {
    name: "Toyota Land Cruiser V8",
    slug: "toyota-land-cruiser-v8",
    category: "SUV",
    seats: 7,
    pricePerDay: 25000,
    description:
      "The flagship of our fleet. The Land Cruiser V8 is the ultimate expression of luxury and off-road mastery — reserved for the most special journeys.",
    transmission: "Automatic",
    fuelType: "Petrol",
    mileageLimitKmPerDay: 300,
    extraKmCharge: 50,
    outOfCitySurcharge: 4000,
  },
];

const defaultSettings = [
  { key: "ADVANCE_PERCENT", value: "40" },
  { key: "CNIC_PURGE_DAYS", value: "30" },
  { key: "BANK_DETAILS", value: "Bank: HBL | Title: Royal Wheels | IBAN: PK00HABB0000000000000000" },
  { key: "CONTACT_PHONE", value: "0300-5245427" },
  { key: "CONTACT_EMAIL", value: "info@royalwheels.com.pk" },
  { key: "CONTACT_WHATSAPP", value: "923005245427" },
];

async function main() {
  console.log("Seeding database...");

  // Seed vehicles
  for (const v of vehicles) {
    await prisma.vehicle.upsert({
      where: { slug: v.slug },
      update: {},
      create: { ...v, images: "[]" },
    });
  }
  console.log(`✓ ${vehicles.length} vehicles seeded`);

  // Seed admin
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@royalwheels.com.pk";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123";
  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashSync(adminPassword, 12),
      name: "Admin",
    },
  });
  console.log(`✓ Admin seeded (${adminEmail})`);

  // Seed settings
  for (const s of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log(`✓ Default settings seeded`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
