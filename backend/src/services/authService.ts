import { and, eq, isNull } from 'drizzle-orm';
import { db } from '@/db/drizzle.js';
import { profiles, users, type ProfileRecord, type UserRecord } from '@/db/schema.js';

/** A user row plus their profile (null when the account has no profile yet). */
export type SignInUser = UserRecord & { profile: ProfileRecord | null };

class AuthService {
  /**
   * Looks up the account for a sign-in attempt.
   *
   * The user and their profile are fetched in ONE query (a single round-trip to
   * the database) rather than a user lookup followed by a separate profile
   * lookup. The caller supplies an already lower-cased email.
   */
  public async findUserForSignIn(email: string): Promise<SignInUser | null> {
    const [row] = await db
      .select({ user: users, profile: profiles })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);

    if (!row) {
      return null;
    }

    // A LEFT JOIN with no match yields a row of null profile columns; the
    // sign-in response must report `profile: null` in that case, not an object
    // of nulls.
    const profile = row.profile?.id ? row.profile : null;

    return { ...row.user, profile };
  }
}

export const authService = new AuthService();
