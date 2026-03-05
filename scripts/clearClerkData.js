#!/usr/bin/env node

/**
 * ⚠️  DANGER: This script deletes ALL users from Clerk
 * 
 * Usage (PowerShell):
 *   node scripts/clearClerkData.js                     # Dry run
 *   $env:CONFIRM='true'; node scripts/clearClerkData.js
 * 
 * Usage (Bash):
 *   node scripts/clearClerkData.js                     # Dry run
 *   CONFIRM=true node scripts/clearClerkData.js
 * 
 * This will:
 * 1. Fetch all users from Clerk
 * 2. Delete each user (including all their sessions, metadata, etc.)
 * 3. Remove all user progress from the database
 */

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

// Load .env file manually
const envPath = path.resolve(__dirname, "../.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    const value = valueParts.join("=").trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  });
}

const clerkClient = require("@clerk/nextjs/server").clerkClient;
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const CONFIRM = process.env.CONFIRM === "true";

async function clearAllClerkData() {
  console.log("🔔 Clerk Data Clearance Script");
  console.log("━".repeat(50));

  if (!CONFIRM) {
    console.log("⚠️  DRY RUN MODE (no changes will be made)");
    console.log("To actually delete users, set: CONFIRM=true\n");
    console.log("PowerShell: $env:CONFIRM='true'; node scripts/clearClerkData.js");
    console.log("Bash:       CONFIRM=true node scripts/clearClerkData.js\n");
  } else {
    console.log("🚨 LIVE MODE: Users will be deleted!\n");
  }

  try {
    // Initialize Clerk client (it's an async function)
    const clerk = await clerkClient();

    // Fetch all users from Clerk
    console.log("📥 Fetching all users from Clerk...");
    const response = await clerk.users.getUserList();
    const users = response.data || [];

    if (!users || users.length === 0) {
      console.log("✅ No users found in Clerk.");
      return;
    }

    console.log(`Found ${users.length} user(s)\n`);

    // Delete each user
    let deleted = 0;
    for (const user of users) {
      const email = user.primaryEmailAddress?.emailAddress || "no email";
      console.log(`Processing user: ${user.id} (${email})`);

      if (CONFIRM) {
        // Delete the user (Clerk automatically revokes all sessions)
        try {
          await clerk.users.deleteUser(user.id);
          console.log(`  ✅ Deleted from Clerk`);
          deleted++;
        } catch (e) {
          console.log(`  ❌ Failed to delete: ${e.message}`);
        }

        // Remove from database
        try {
          await prisma.userProgress.delete({
            where: { userId: user.id },
          });
          console.log(`  ✅ Deleted from database`);
        } catch {
          // User may not exist in database, that's okay
          console.log(`  ℹ️  Not in database (or already deleted)`);
        }
      } else {
        console.log(`  [DRY RUN] Would delete this user`);
        deleted++;
      }
    }

    console.log("\n" + "━".repeat(50));
    if (CONFIRM) {
      console.log(`✅ Deleted ${deleted} user(s) successfully!`);
      console.log("🗑️  All Clerk data and user progress have been cleared.");
    } else {
      console.log(`ℹ️  DRY RUN: Would have deleted ${deleted} user(s)`);
      console.log("Run with CONFIRM=true to actually delete.");
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

clearAllClerkData();
