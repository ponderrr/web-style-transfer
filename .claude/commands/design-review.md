---
command: design-review
description: Conduct comprehensive S-Tier design review following Stripe/Linear/Airbnb standards
parameters:
  - url: Target website URL for review (optional if using --file)
  - file: Local HTML file path for review (optional if using --url)
  - output: Output path for review report (optional, defaults to ./reports/design-review.json)
  - screenshots: Capture screenshots during review (optional, default: true)
  - interactive: Enable interactive testing mode (optional, default: false)
  - strict: Use strict S-Tier standards (optional, default: false)
  - focus: Focus areas (optional, comma-separated: visual,interaction,accessibility,performance,content)
---

Conducts a comprehensive design review following the rigorous standards of top Silicon Valley companies (Stripe, Linear, Airbnb). This command evaluates design quality, accessibility compliance, performance optimization, and user experience excellence.

## Usage Examples

```
/design-review https://stripe.com
/design-review https://my-website.com --output ./reports/stripe-review.json
/design-review --file ./index.html --screenshots true
/design-review https://example.com --interactive --strict
/design-review https://site.com --focus visual,accessibility,performance
```

## Review Methodology

### S-Tier Standards Framework
Our review follows the exacting standards that made Stripe, Linear, and Airbnb design leaders:

#### 1. Visual Excellence
- **Design Tokens**: Consistent use of design tokens throughout
- **Spacing Grid**: Perfect 8px grid implementation
- **Typography Scale**: Modular scale with optimal line heights
- **Color System**: Semantic colors with WCAG AA contrast ratios
- **Visual Hierarchy**: Clear, intentional information architecture

#### 2. Interaction Design
- **Micro-interactions**: Subtle, purposeful animations under 300ms
- **Feedback Systems**: Immediate, clear feedback for all interactions
- **State Management**: Proper hover, active, focus, disabled states
- **Touch Targets**: Minimum 44px touch targets on mobile
- **Loading States**: Skeleton screens and progressive loading

#### 3. Accessibility (WCAG 2.1 AA)
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: 4.5:1 minimum for normal text, 3:1 for large text
- **Focus Management**: Visible, consistent focus indicators
- **Touch Accessibility**: Gesture support and touch target sizing

#### 4. Performance Optimization
- **Core Web Vitals**: Meet or exceed good thresholds
- **Bundle Optimization**: Efficient code splitting and lazy loading
- **Image Optimization**: Modern formats with proper sizing
- **Critical Path**: Optimized above-the-fold loading
- **Caching Strategy**: Effective resource caching

#### 5. Content & Information Architecture
- **Content Hierarchy**: Clear, scannable content structure
- **Writing Quality**: Grammar, clarity, and brand voice consistency
- **SEO Optimization**: Proper meta tags and structured data
- **User Flows**: Intuitive navigation and conversion paths
- **Mobile Experience**: Touch-friendly interactions and layouts

## Review Process

### Phase 0: Preparation & Planning
1. **Context Gathering**: Understand project goals and target audience
2. **Environment Setup**: Configure Playwright with proper viewport settings
3. **Baseline Establishment**: Set performance and quality benchmarks
4. **Scope Definition**: Determine review focus areas and depth

### Phase 1: Live Environment Assessment
1. **Initial Load**: Assess first impression and loading experience
2. **Viewport Testing**: Test across mobile (375px), tablet (768px), desktop (1440px)
3. **Interactive Exploration**: Navigate through primary user flows
4. **Performance Monitoring**: Track Core Web Vitals and loading metrics

### Phase 2: Systematic Component Review
1. **Navigation Systems**: Header, sidebar, mobile menu, breadcrumbs
2. **Content Presentation**: Typography, spacing, visual hierarchy
3. **Interactive Elements**: Buttons, forms, links, controls
4. **Feedback Systems**: Loading states, error handling, success messages
5. **Layout Systems**: Grid usage, responsive behavior, content flow

### Phase 3: Accessibility Deep Dive
1. **Keyboard Navigation**: Tab order, focus management, keyboard traps
2. **Screen Reader Support**: ARIA labels, semantic HTML, landmark roles
3. **Color & Contrast**: Contrast ratios, color blindness considerations
4. **Touch & Gesture**: Mobile accessibility, touch target sizes
5. **Error Prevention**: Form validation, error messaging, help text

### Phase 4: Performance Analysis
1. **Loading Performance**: First Contentful Paint, Largest Contentful Paint
2. **Interaction Performance**: First Input Delay, Cumulative Layout Shift
3. **Resource Optimization**: Bundle sizes, image optimization, caching
4. **Network Efficiency**: Request optimization, compression, CDN usage

### Phase 5: Content & UX Audit
1. **Information Architecture**: Site structure, navigation clarity
2. **Content Quality**: Writing clarity, brand voice consistency
3. **User Flows**: Conversion paths, task completion efficiency
4. **Mobile Experience**: Touch interactions, mobile-specific patterns

### Phase 6: Technical Implementation Review
1. **Code Quality**: Component reuse, design token usage
2. **Build Optimization**: Bundle analysis, tree shaking effectiveness
3. **Browser Compatibility**: Cross-browser testing and fallbacks
4. **Progressive Enhancement**: Core functionality without JavaScript

## Review Report Structure

### Executive Summary
```
Design Review Summary
===================

Overall Score: 8.7/10 (Good)
Review Date: 2024-01-01
Reviewer: Claude Design Review Agent
Target: https://example.com

Key Findings:
- Strong visual design foundation with consistent design tokens
- Excellent accessibility compliance (WCAG AA)
- Good performance metrics but room for improvement
- Minor inconsistencies in interaction patterns
```

### Detailed Findings

#### Blockers (Critical Issues)
- [ ] **Color Contrast Failure**: Text contrast ratio below 4.5:1
- [ ] **Keyboard Navigation Broken**: Critical user flows inaccessible
- [ ] **Performance Issues**: Core Web Vitals below acceptable thresholds
- [ ] **Mobile Usability**: Touch targets smaller than 44px

#### High Priority Issues
- [ ] **Design Token Inconsistency**: Mixed spacing values not following 8px grid
- [ ] **Typography Hierarchy**: Inconsistent heading sizes across pages
- [ ] **Loading States Missing**: No feedback during async operations
- [ ] **Focus Management**: Missing focus indicators on interactive elements

#### Medium Priority Issues
- [ ] **Animation Performance**: Some animations exceed 300ms
- [ ] **Image Optimization**: Large images not properly optimized
- [ ] **Bundle Size**: JavaScript bundle could be smaller
- [ ] **Error Handling**: Generic error messages could be more helpful

#### Nitpicks (Minor Improvements)
- Nit: Button hover state could be more subtle
- Nit: Loading spinner could match brand colors better
- Nit: Form spacing could be more consistent

### Performance Metrics
```
Core Web Vitals:
├── First Contentful Paint: 1.8s (Good)
├── Largest Contentful Paint: 2.5s (Good)
├── First Input Delay: 120ms (Needs Improvement)
├── Cumulative Layout Shift: 0.08 (Good)
└── Speed Index: 3.2s (Good)

Bundle Analysis:
├── Total JavaScript: 450KB (Acceptable)
├── Initial Bundle: 180KB (Good)
├── Largest Asset: 120KB (Needs Optimization)
└── Unused Code: 15KB (Minor)
```

### Accessibility Score
```
WCAG 2.1 AA Compliance: 95% (Excellent)

✅ Passed Checks:
├── Color Contrast: All text meets 4.5:1 ratio
├── Keyboard Navigation: Full keyboard support
├── Screen Reader Support: Proper ARIA labels
├── Focus Management: Clear focus indicators
└── Touch Targets: All targets ≥44px

⚠️  Needs Attention:
├── Alt Text: 2 images missing alt attributes
├── Heading Hierarchy: 1 heading level skipped
└── Form Labels: 1 form field needs association
```

### Recommendations

#### Immediate Actions (This Sprint)
1. **Fix Color Contrast**: Update low-contrast text combinations
2. **Add Loading States**: Implement skeleton screens for async content
3. **Optimize Images**: Convert to WebP and add responsive sizing
4. **Fix Keyboard Navigation**: Ensure all interactive elements are keyboard accessible

#### Short-term Improvements (Next Sprint)
1. **Design Token Audit**: Audit and standardize all spacing values
2. **Performance Optimization**: Implement code splitting and lazy loading
3. **Accessibility Enhancement**: Add ARIA labels for complex components
4. **Mobile Optimization**: Improve touch interactions and gestures

#### Long-term Strategy
1. **Design System Maturity**: Expand component library coverage
2. **Performance Monitoring**: Implement continuous performance monitoring
3. **User Testing**: Conduct usability testing with target users
4. **Accessibility Program**: Establish accessibility as ongoing practice

## Screenshots & Evidence

### Visual Issues
- `screenshot_001.png`: Low contrast text in footer
- `screenshot_002.png`: Inconsistent spacing in card grid
- `screenshot_003.png`: Missing focus indicator on dropdown

### Performance Issues
- `lighthouse_report.pdf`: Complete Lighthouse performance audit
- `bundle_analysis.json`: Webpack bundle size analysis
- `network_waterfall.png`: Network request waterfall diagram

### Accessibility Issues
- `keyboard_navigation.mp4`: Video demonstration of keyboard navigation
- `screen_reader_test.mp4`: Screen reader compatibility testing
- `contrast_analysis.png`: Color contrast ratio measurements

## Scoring Methodology

### Overall Score Calculation
```
Overall Score = (
  Visual Design (25%) +
  Interaction Design (20%) +
  Accessibility (25%) +
  Performance (15%) +
  Content & UX (10%) +
  Technical Implementation (5%)
) / 100
```

### Quality Tiers
- **S-Tier (9.0-10.0)**: World-class, exceeds industry standards
- **A-Tier (8.0-8.9)**: Excellent, meets all standards, minor room for improvement
- **B-Tier (7.0-7.9)**: Good, meets most standards, some issues to address
- **C-Tier (6.0-6.9)**: Acceptable, basic functionality works, needs improvement
- **D-Tier (0-5.9)**: Poor, significant issues requiring major rework

## Configuration Options

### Review Focus Areas
```bash
# Visual design focus
/design-review https://site.com --focus visual

# Accessibility priority
/design-review https://site.com --focus accessibility

# Performance optimization
/design-review https://site.com --focus performance

# Multiple focus areas
/design-review https://site.com --focus visual,accessibility,performance
```

### Strict Mode Settings
```bash
# S-Tier strict standards (Stripe/Linear level)
/design-review https://site.com --strict

# Custom quality thresholds
/design-review https://site.com --thresholds '{"accessibility": 0.95, "performance": 0.9}'
```

### Interactive Mode
```bash
# Interactive review with step-by-step guidance
/design-review https://site.com --interactive

# Guided review for specific components
/design-review https://site.com --interactive --component navigation,buttons,forms
```

## Automated Testing Integration

### Continuous Integration
```yaml
# .github/workflows/design-review.yml
name: Design Review
on: [pull_request]
jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install Playwright
        run: npx playwright install
      - name: Run Design Review
        run: npx design-review ${{ github.event.pull_request.head.repo.html_url }}
      - name: Upload Review Report
        uses: actions/upload-artifact@v2
        with:
          name: design-review-report
          path: ./reports/design-review.json
```

### Quality Gates
```yaml
# Block deployment if quality below threshold
- name: Quality Gate
  run: |
    SCORE=$(jq '.overall' ./reports/design-review.json)
    if [ $(echo "$SCORE < 0.8" | bc -l) -eq 1 ]; then
      echo "Design quality below threshold: $SCORE"
      exit 1
    fi
```

## Error Handling

### Network Issues
- **Timeout Handling**: Automatic retry with exponential backoff
- **Content Blocking**: Respect robots.txt and implement delays
- **Dynamic Content**: Wait for SPA loading and animations
- **Rate Limiting**: Polite crawling with appropriate delays

### Parsing Errors
- **Malformed HTML**: Robust parsing with error recovery
- **Missing Assets**: Graceful handling of broken images/links
- **JavaScript Errors**: Continue review with degraded functionality
- **Cross-origin Issues**: Fallback to available content

### Performance Issues
- **Slow Loading**: Extended timeouts for comprehensive sites
- **Large Pages**: Chunked analysis for performance
- **Resource Intensive**: Optimized resource usage monitoring

## Best Practices

### Review Preparation
1. **Define Success Criteria**: Establish clear quality thresholds upfront
2. **Understand Context**: Review project goals, target users, and constraints
3. **Set Expectations**: Communicate review scope and methodology
4. **Prepare Environment**: Ensure stable testing environment

### During Review
1. **Follow User Flows**: Test actual user journeys, not just components
2. **Test Edge Cases**: Verify error states, loading states, empty states
3. **Cross-device Testing**: Validate mobile, tablet, desktop experiences
4. **Accessibility First**: Prioritize accessibility in all recommendations

### After Review
1. **Prioritize Issues**: Use severity levels to guide development effort
2. **Provide Context**: Explain why issues matter and their user impact
3. **Suggest Solutions**: Offer actionable recommendations with examples
4. **Track Progress**: Establish metrics for measuring improvement

## Success Metrics

### Review Quality
- **Issue Accuracy**: >95% of identified issues are valid
- **Severity Calibration**: Appropriate severity assignment
- **Actionability**: >90% of recommendations are implementable
- **User Impact**: Clear explanation of user experience impact

### Process Efficiency
- **Review Speed**: Complete comprehensive review in <30 minutes
- **Automation Level**: >80% of checks automated
- **False Positive Rate**: <5% of flagged issues are not actual problems
- **Team Satisfaction**: >90% positive feedback from development teams

## Integration with Development Workflow

### Pull Request Integration
- **Automated Reviews**: Trigger design review on PR creation
- **Quality Gates**: Block merges below quality thresholds
- **Review Assignments**: Route reviews to appropriate team members
- **Progress Tracking**: Monitor design quality trends over time

### Design System Integration
- **Token Validation**: Ensure new components use established design tokens
- **Pattern Compliance**: Verify adherence to established UI patterns
- **Accessibility Standards**: Enforce accessibility requirements
- **Performance Benchmarks**: Maintain performance standards

### Continuous Improvement
- **Metrics Tracking**: Monitor design quality and accessibility trends
- **Process Optimization**: Refine review criteria based on findings
- **Team Training**: Use review feedback to improve design skills
- **Standards Evolution**: Update standards based on industry best practices

## Resources & References

### Design Standards
- [Stripe Design](https://stripe.com/docs/design)
- [Linear Design](https://linear.app/design)
- [Airbnb Design](https://airbnb.io/design/)
- [Material Design](https://material.io/design)

### Accessibility Guidelines
- [WCAG 2.1 AA Checklist](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Color Contrast Analyzer](https://developer.paciellogroup.com/resources/contrastanalyser/)

### Performance Optimization
- [Core Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance](https://developers.google.com/web/tools/lighthouse)
- [Bundle Analyzer](https://webpack.js.org/guides/code-splitting/)

### Tools & Automation
- [Playwright Testing](https://playwright.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Storybook](https://storybook.js.org/)
- [Chromatic](https://www.chromatic.com/)

## Emergency Reviews

### Critical Issues Requiring Immediate Attention
- **Security Vulnerabilities**: Affecting user data or privacy
- **Accessibility Blockers**: Preventing users with disabilities from completing tasks
- **Performance Degradation**: Significant impact on user experience
- **Brand Damage**: Visual issues affecting brand perception

### Response Time Commitments
- **Critical Issues**: Review completed within 2 hours
- **High Priority**: Review completed within 6 hours
- **Medium Priority**: Review completed within 24 hours
- **Low Priority**: Review completed within 72 hours

## Future Enhancements

### AI-Powered Analysis
- **Automated Issue Detection**: Use computer vision for visual inconsistency detection
- **Smart Recommendations**: ML-powered improvement suggestions
- **Predictive Analysis**: Anticipate potential issues before they occur
- **Personalized Reviews**: Tailored feedback based on project context

### Advanced Automation
- **Visual Regression**: Automated screenshot comparison
- **Performance Monitoring**: Continuous performance tracking
- **Accessibility Monitoring**: Ongoing accessibility compliance
- **User Experience Testing**: Automated usability testing

### Integration Expansion
- **Design Tools**: Figma, Sketch, Adobe XD integration
- **CI/CD Platforms**: GitHub Actions, GitLab CI, Jenkins
- **Project Management**: Jira, Linear, Asana integration
- **Communication**: Slack, Discord, Teams notifications

---

**Note**: This design review system is designed to catch issues early, provide actionable feedback, and ensure that every product meets the highest standards of design excellence, accessibility, and user experience.
