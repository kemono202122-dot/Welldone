import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // --- RENDERING ONBOARDING SCREEN (AS PER REQUESTED UI) ---
  if (!hasCompletedOnboarding) {
    return (
      <View style={styles.onboardingContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#FAF7F2" />
        <SafeAreaView style={styles.onboardingSafeArea}>
          <ScrollView 
            contentContainerStyle={styles.onboardingScroll} 
            showsVerticalScrollIndicator={false}
          >
            {/* Top Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                {/* 5-dot cross/flower pattern */}
                <View style={styles.dotRow}>
                  <View style={styles.logoDot} />
                </View>
                <View style={[styles.dotRow, { gap: 10 }]}>
                  <View style={styles.logoDot} />
                  <View style={styles.logoDot} />
                </View>
                <View style={styles.dotRow}>
                  <View style={styles.logoDot} />
                </View>
              </View>
            </View>

            {/* Headline Section */}
            <View style={styles.textSection}>
              <Text style={styles.mainTitle}>
                Welcome Chandrapal to{'\n'}Able AI Mental App
              </Text>
              <Text style={styles.subtitle}>
                Your mindful mental health AI companion{'\n'}for everyone, anywhere 🍃
              </Text>
            </View>

            {/* Central Illustration Area */}
            <View style={styles.illustrationContainer}>
              {/* Warm Backdrop Circle */}
              <View style={styles.backdropCircle} />

              {/* Sage Green Mascot Body */}
              <View style={styles.mascotBody}>
                {/* Terracotta Orange Left Arm */}
                <View style={[styles.mascotArm, styles.armLeft]}>
                  {/* Highlight stripe on the arm */}
                  <View style={styles.armHighlight} />
                </View>

                {/* Terracotta Orange Right Arm */}
                <View style={[styles.mascotArm, styles.armRight]}>
                  {/* Highlight stripe on the arm */}
                  <View style={styles.armHighlight} />
                </View>

                {/* Smiling White Face */}
                <View style={styles.mascotFace}>
                  {/* Two cute eyes */}
                  <View style={styles.eyesRow}>
                    <View style={styles.mascotEye} />
                    <View style={styles.mascotEye} />
                  </View>
                  {/* Smiling mouth */}
                  <View style={styles.mascotSmile} />
                </View>

                {/* Small Chest Badge (ID Card) */}
                <View style={styles.chestBadge}>
                  <View style={styles.badgeLayout}>
                    <View style={styles.badgeCircle} />
                    <View style={styles.badgeLine} />
                  </View>
                </View>
              </View>

              {/* Floating Circle 1: Monitor / Chart (Top-Left) */}
              <View style={[styles.floatingCircle, styles.floatMonitor]}>
                <Ionicons name="desktop-outline" size={22} color="#FFFFFF" />
                <View style={styles.chartLineOverlay}>
                  <MaterialCommunityIcons name="trending-up" size={14} color="#E86D2A" style={styles.chartLineIcon} />
                </View>
              </View>

              {/* Floating Circle 2: Lightbulb with bolt (Top-Right) */}
              <View style={[styles.floatingCircle, styles.floatLightbulb]}>
                <Feather name="zap" size={22} color="#FFFFFF" />
              </View>

              {/* Floating Circle 3: Archive Box / Storage (Bottom-Right) */}
              <View style={[styles.floatingCircle, styles.floatArchive]}>
                <Feather name="archive" size={22} color="#FFFFFF" />
              </View>

              {/* Floating Decorative Element: Terracotta Paperclip (Bottom-Left) */}
              <View style={styles.floatPaperclip}>
                <View style={styles.clipInner} />
              </View>

              {/* Floating Decorative Element: Purple Circle Outline (Mid-Left) */}
              <View style={styles.floatPurpleCircle} />

              {/* Floating Decorative Element: Yellow Squiggle Wave (Top-Right) */}
              <View style={styles.floatYellowWave}>
                <View style={styles.waveSegment} />
                <View style={[styles.waveSegment, { transform: [{ rotate: '45deg' }] }]} />
              </View>

              {/* Floating Decorative Element: Yellow Crescent (Bottom-Mid) */}
              <View style={styles.floatYellowCrescent} />
            </View>

            {/* Bottom Interaction Area */}
            <View style={styles.actionSection}>
              {/* "Get Started" Pill Button */}
              <TouchableOpacity 
                style={styles.getStartedButton}
                activeOpacity={0.8}
                onPress={() => setHasCompletedOnboarding(true)}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <Feather name="arrow-right" size={20} color="#FFFFFF" style={styles.arrowIcon} />
              </TouchableOpacity>

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={styles.signInNormalText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => setHasCompletedOnboarding(true)}>
                  <Text style={styles.signInLinkText}>Sign In.</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // --- RENDERING ACTUAL WELCOME/DASHBOARD HOMEPAGE ---
  return (
    <View style={styles.homeContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#134E4A" />
      <SafeAreaView style={styles.homeSafeArea}>
        <ScrollView 
          contentContainerStyle={styles.homeScroll} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerWelcome}>Welcome back,</Text>
              <Text style={styles.headerName}>Chandrapal 👋</Text>
            </View>
            <TouchableOpacity style={styles.notifButton}>
              <Ionicons name="notifications-outline" size={24} color="#134E4A" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>

          {/* Quick Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: '#CCFBF1' }]}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Water Intake</Text>
                <Feather name="droplet" size={18} color="#0D9488" />
              </View>
              <Text style={styles.statValue}>1.8 L</Text>
              <Text style={styles.statGoal}>Goal: 2.5 L</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: '#EDE9FE' }]}>
              <View style={styles.statHeader}>
                <Text style={styles.statLabel}>Sleep Session</Text>
                <Feather name="moon" size={18} color="#7C3AED" />
              </View>
              <Text style={styles.statValue}>7h 45m</Text>
              <Text style={styles.statGoal}>Goal: 8h 00m</Text>
            </View>
          </View>

          {/* AI Partner Greeting Banner */}
          <View style={styles.aiPartnerBanner}>
            <View style={styles.aiBannerInfo}>
              <Text style={styles.aiBannerTitle}>Virtual Wellness Partner</Text>
              <Text style={styles.aiBannerDesc}>
                "Ready for our morning mindfulness check-in today?"
              </Text>
              <TouchableOpacity 
                style={styles.chatNowBtn}
                onPress={() => alert("Launching Live Voice Session...")}
              >
                <Ionicons name="mic-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.chatNowText}>Start Voice Call</Text>
              </TouchableOpacity>
            </View>
            {/* Mascot in Header */}
            <View style={[styles.mascotBody, { width: 70, height: 80, borderRadius: 35, transform: [{ scale: 0.8 }] }]}>
              <View style={[styles.mascotFace, { width: 50, height: 40, top: 15, left: 10 }]}>
                <View style={styles.eyesRow}>
                  <View style={[styles.mascotEye, { width: 4, height: 4 }]} />
                  <View style={[styles.mascotEye, { width: 4, height: 4 }]} />
                </View>
                <View style={[styles.mascotSmile, { width: 8, height: 6 }]} />
              </View>
            </View>
          </View>

          {/* Daily Goal checklist */}
          <Text style={styles.sectionTitle}>Your Goals for Today</Text>
          <View style={styles.goalCard}>
            <View style={styles.goalRow}>
              <Ionicons name="checkmark-circle" size={24} color="#0D9488" />
              <Text style={styles.goalText}>Complete 15-minute Guided Yoga</Text>
            </View>
            <View style={styles.goalDivider} />
            <View style={styles.goalRow}>
              <Ionicons name="checkmark-circle" size={24} color="#0D9488" />
              <Text style={styles.goalText}>Hydration level above 1.5 Liters</Text>
            </View>
            <View style={styles.goalDivider} />
            <View style={styles.goalRow}>
              <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />
              <Text style={[styles.goalText, { color: '#64748B' }]}>Log mood inside Wellness Journal</Text>
            </View>
          </View>

          {/* Reset Onboarding Button */}
          <TouchableOpacity 
            style={styles.resetBtn} 
            onPress={() => setHasCompletedOnboarding(false)}
          >
            <Text style={styles.resetBtnText}>View Welcome Onboarding</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // --- ONBOARDING STYLES (MATCHES THE SCREENSHOT) ---
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#FAF7F2', // Warm cream background
  },
  onboardingSafeArea: {
    flex: 1,
  },
  onboardingScroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  logoContainer: {
    marginTop: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4E3220', // Dark chocolate brown logo base
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  logoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF', // White dots in cross pattern
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#3C2415', // Dark brown header
    textAlign: 'center',
    lineHeight: 34,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
  },
  subtitle: {
    fontSize: 15,
    color: '#7C675B', // Grey-brown subtext
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    fontWeight: '400',
  },
  illustrationContainer: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 15,
  },
  backdropCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#F3ECE0', // Soft off-white backdrop circle
    position: 'absolute',
    zIndex: -1,
  },
  mascotBody: {
    width: 140,
    height: 160,
    borderRadius: 70,
    backgroundColor: '#8BAB70', // Sage green body color
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#4A3728',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  mascotArm: {
    width: 44,
    height: 76,
    borderRadius: 22,
    backgroundColor: '#E57335', // Terracotta orange arms
    position: 'absolute',
    top: 50,
  },
  armLeft: {
    left: -20,
    transform: [{ rotate: '25deg' }],
  },
  armRight: {
    right: -20,
    transform: [{ rotate: '-25deg' }],
  },
  armHighlight: {
    width: 6,
    height: 35,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    position: 'absolute',
    top: 15,
    alignSelf: 'center',
  },
  mascotFace: {
    width: 90,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF', // White face insert
    position: 'absolute',
    top: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyesRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 6,
  },
  mascotEye: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3C2415', // Dark brown eyes
  },
  mascotSmile: {
    width: 14,
    height: 10,
    borderBottomWidth: 2,
    borderColor: '#3C2415', // Smiling mouth
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  chestBadge: {
    width: 50,
    height: 30,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#4A3220',
    backgroundColor: '#FAF7F2',
    position: 'absolute',
    bottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E57335',
  },
  badgeLine: {
    width: 18,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#4E3220',
  },
  floatingCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E57335', // Orange icon circles
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  floatMonitor: {
    top: 20,
    left: 15,
  },
  chartLineOverlay: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    bottom: 8,
    right: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartLineIcon: {
    transform: [{ scale: 0.8 }],
  },
  floatLightbulb: {
    top: 45,
    right: 15,
  },
  floatArchive: {
    bottom: 20,
    right: 25,
  },
  floatPaperclip: {
    width: 26,
    height: 50,
    borderRadius: 13,
    borderWidth: 3,
    borderColor: '#E57335',
    position: 'absolute',
    bottom: 25,
    left: 20,
    transform: [{ rotate: '-45deg' }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  clipInner: {
    width: 12,
    height: 32,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E57335',
  },
  floatPurpleCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: '#C3B6E4', // Soft purple outline circle
    position: 'absolute',
    left: 5,
    top: 135,
  },
  floatYellowWave: {
    width: 24,
    height: 12,
    position: 'absolute',
    right: 50,
    top: 15,
    flexDirection: 'row',
  },
  waveSegment: {
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FDD267', // Squiggle shapes
  },
  floatYellowCrescent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderColor: '#FDD267', // Yellow accent curve at the bottom
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
  },
  actionSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  getStartedButton: {
    width: width * 0.65,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#4E3220', // Dark brown pill button
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4E3220',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  arrowIcon: {
    marginLeft: 8,
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 18,
  },
  signInNormalText: {
    fontSize: 13.5,
    color: '#8A766B',
  },
  signInLinkText: {
    fontSize: 13.5,
    color: '#E57335', // Orange highlighted link
    fontWeight: '700',
  },

  // --- MAIN DASHBOARD HOMEPAGE STYLES ---
  homeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  homeSafeArea: {
    flex: 1,
  },
  homeScroll: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerWelcome: {
    fontSize: 14,
    color: '#64748B',
  },
  headerName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  notifButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 12,
    right: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  statGoal: {
    fontSize: 11,
    color: '#475569',
    marginTop: 4,
  },
  aiPartnerBanner: {
    backgroundColor: '#134E4A',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#134E4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  aiBannerInfo: {
    flex: 1,
    marginRight: 10,
  },
  aiBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CCFBF1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  aiBannerDesc: {
    fontSize: 15,
    color: '#FFFFFF',
    lineHeight: 20,
    marginBottom: 14,
    fontStyle: 'italic',
  },
  chatNowBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#0D9488',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatNowText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  goalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  goalText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    marginLeft: 12,
  },
  goalDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  resetBtn: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#FFFFFF',
  },
  resetBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
