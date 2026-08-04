/**
 * Love Sync Deterministic Algorithmic Suite
 * High-performance, zero-cost mathematical models replacing LLM calls.
 */

export interface MatchingWeights {
  familyGoals: number;
  lifestyle: number;
  personality: number;
  values: number;
  interests: number;
  distance: number;
  age: number;
}

export interface VerificationStatus {
  email: boolean;
  phone: boolean;
  photo: boolean;
  id: boolean;
}

export interface ProfileDetails {
  introduction?: string;
  lifestyleText?: string;
  valuesText?: string;
  goalsText?: string;
  interestsText?: string;
  relationshipExpectations?: string;
}

export interface AlgorithmicProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  location: string;
  country: string;
  distanceKm: number;
  languages: string[];
  verification: VerificationStatus;
  categories: {
    familyGoals: number;
    lifestyle: number;
    personality: number;
    values: number;
    interests: number;
    distance: number;
    age: number;
  };
  details?: ProfileDetails;
  activityScore?: number; // 0-100
  engagementScore?: number; // 0-100
  reportHistoryCount?: number;
  deviceFingerprintsCount?: number;
  ipSwitchesCount?: number;
  messageVelocityPerMin?: number;
}

/**
 * 1. Weighted Euclidean Distance & Cosine Similarity Matching Algorithm
 * Combines category Euclidean distance, Jaccard interests overlap,
 * language compatibility, distance decay, and trust score multipliers.
 */
export function calculateMatchScore(
  user: { age: number; languages: string[]; categories?: any; verification?: any },
  partner: AlgorithmicProfile,
  weights: MatchingWeights
): number {
  const totalWeights = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeights === 0) return 0;

  // A. Weighted Euclidean Distance Compatibility
  let weightedSquaredDiff = 0;
  const fields: Array<keyof MatchingWeights> = [
    'familyGoals', 'lifestyle', 'personality', 'values', 'interests', 'distance', 'age'
  ];

  for (const field of fields) {
    const uWeight = weights[field];
    const uScore = user.categories ? (user.categories[field] || 100) : 100;
    const vScore = partner.categories[field] || 0;
    weightedSquaredDiff += uWeight * Math.pow(uScore - vScore, 2);
  }

  const meanSquaredDiff = weightedSquaredDiff / totalWeights;
  const euclideanCompatibility = 100 - Math.sqrt(meanSquaredDiff);

  // B. Exponential Distance Decay
  const distanceDecay = Math.exp(-partner.distanceKm / 8000);

  // C. Jaccard Similarity on raw interest strings (if details are available)
  let jaccardSimilarity = 1.0;
  if (user.categories?.interestsText && partner.details?.interestsText) {
    const uInterests = new Set<string>(
      String(user.categories.interestsText).toLowerCase().split(',').map((i: string) => i.trim())
    );
    const pInterests = new Set<string>(
      String(partner.details.interestsText).toLowerCase().split(',').map((i: string) => i.trim())
    );
    
    const intersection = new Set<string>([...uInterests].filter((x: string) => pInterests.has(x)));
    const union = new Set<string>([...uInterests, ...pInterests]);
    if (union.size > 0) {
      jaccardSimilarity = 0.8 + 0.2 * (intersection.size / union.size);
    }
  }

  // D. Language Overlap Weighting
  const sharedLanguages = partner.languages.filter(lang => 
    user.languages.map(l => l.toLowerCase()).includes(lang.toLowerCase())
  );
  const languageMultiplier = sharedLanguages.length > 0 ? 1.0 : 0.85;

  // E. Trust Multiplier (up to +10% bonus for verified profiles)
  const trustMultiplier = 1.0 + (0.025 * getVerifiedBadgesCount(partner.verification));

  // Combine components
  const compositeScore = Math.round(
    euclideanCompatibility * distanceDecay * jaccardSimilarity * languageMultiplier * trustMultiplier
  );

  return Math.max(0, Math.min(100, compositeScore));
}

/**
 * 2. Profile Completeness Algorithm
 * Analyzes the percentage of profile details filled.
 */
export function calculateProfileCompleteness(profile: AlgorithmicProfile): number {
  let score = 0;
  let total = 0;

  const checkField = (val: any) => {
    total++;
    if (val && (typeof val !== 'object' || Object.keys(val).length > 0)) {
      score++;
    }
  };

  checkField(profile.name);
  checkField(profile.age);
  checkField(profile.occupation);
  checkField(profile.location);
  checkField(profile.languages);
  checkField(profile.details?.introduction);
  checkField(profile.details?.lifestyleText);
  checkField(profile.details?.valuesText);
  checkField(profile.details?.goalsText);
  checkField(profile.details?.interestsText);

  return total > 0 ? Math.round((score / total) * 100) : 0;
}

/**
 * 3. Trust & Verification Score Engine
 * Compares profile completeness, verification badges, and applies deductions.
 */
export function calculateTrustScore(profile: AlgorithmicProfile): number {
  const completeness = calculateProfileCompleteness(profile);
  const badgesCount = getVerifiedBadgesCount(profile.verification);
  
  // Base verification score (60% weight on badges, 40% on profile completeness)
  let trustScore = (badgesCount * 15) + (completeness * 0.4);

  // Apply deductions based on scam history & velocity behavior
  if (profile.reportHistoryCount) {
    trustScore -= profile.reportHistoryCount * 15;
  }
  if (profile.ipSwitchesCount && profile.ipSwitchesCount > 5) {
    trustScore -= 10;
  }

  return Math.max(0, Math.min(100, Math.round(trustScore)));
}

/**
 * 4. Mathematical Scam Probability Engine
 * Analyzes indicators of suspicious activity deterministically.
 */
export function calculateScamProbability(profile: AlgorithmicProfile): number {
  let score = 0;

  // A. Lack of Verification indicators
  const badgesCount = getVerifiedBadgesCount(profile.verification);
  if (badgesCount === 0) score += 30;
  else if (badgesCount === 1) score += 15;

  // B. Low completeness indicator
  const completeness = calculateProfileCompleteness(profile);
  if (completeness < 30) score += 20;

  // C. Scam profile keywords (deterministic match)
  const scamKeywords = ['oil rig', 'military doctor', 'crypto investor', 'gold trader', 'brokerage agent'];
  const occupationLower = (profile.occupation || '').toLowerCase();
  if (scamKeywords.some(keyword => occupationLower.includes(keyword))) {
    score += 25;
  }

  // D. Velocity checks
  if (profile.messageVelocityPerMin && profile.messageVelocityPerMin > 15) {
    score += 20; // Spam behavior
  }
  if (profile.deviceFingerprintsCount && profile.deviceFingerprintsCount > 3) {
    score += 15; // Device cloning indicator
  }
  if (profile.ipSwitchesCount && profile.ipSwitchesCount > 10) {
    score += 15; // VPN / Proxy hopping indicator
  }

  // E. Reports
  if (profile.reportHistoryCount) {
    score += profile.reportHistoryCount * 20;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * 5. Deterministic Photo Quality Heuristics (without AI)
 * Evaluates images based on file metadata, dimensions, aspect ratio,
 * and compression ratio check to identify blurred/low-quality uploads.
 */
export function calculatePhotoQualityScore(dimensions: { width: number; height: number; sizeBytes: number }): number {
  const { width, height, sizeBytes } = dimensions;
  if (!width || !height || !sizeBytes) return 0;

  let score = 50; // base score

  // Resolution penalty/bonus
  const resolution = width * height;
  if (resolution < 300 * 300) {
    score -= 30; // Very blurry
  } else if (resolution >= 1920 * 1080) {
    score += 20; // HD bonus
  }

  // Aspect ratio check (ideal is near 1:1 or 4:3 portrait for profile, penalize extreme banners)
  const aspectRatio = width / height;
  if (aspectRatio > 2.0 || aspectRatio < 0.5) {
    score -= 15;
  }

  // Compression ratio check (bytes per pixel)
  const bytesPerPixel = sizeBytes / resolution;
  if (bytesPerPixel < 0.05) {
    score -= 20; // High compression artifacts
  } else if (bytesPerPixel > 0.8) {
    score += 10; // High fidelity
  }

  return Math.max(0, Math.min(100, score));
}

// Helpers
function getVerifiedBadgesCount(verification?: VerificationStatus): number {
  if (!verification) return 0;
  let count = 0;
  if (verification.email) count++;
  if (verification.phone) count++;
  if (verification.photo) count++;
  if (verification.id) count++;
  return count;
}
