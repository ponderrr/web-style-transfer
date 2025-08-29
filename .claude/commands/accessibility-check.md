---
command: accessibility-check
description: Run comprehensive WCAG accessibility audit on website or components
parameters:
  - url: Target website URL to audit (optional if using --file)
  - file: Local HTML file path to audit (optional if using --url)
  - output: Output path for accessibility report (optional, defaults to ./reports/accessibility-report.json)
  - level: WCAG conformance level (optional, AA|AAA, defaults to AA)
  - screenshots: Capture screenshots during audit (optional, default: false)
  - interactive: Enable interactive testing mode (optional, default: false)
  - viewport: Viewport size for testing (optional, default: 1440x900)
  - focus: Focus areas (optional, comma-separated: color-contrast|keyboard|screen-reader|semantic|aria|forms|images|navigation)
  - exclude: Exclude certain checks (optional, comma-separated: experimental|best-practice)
  - format: Output format (optional, json|html|csv, defaults to json)
---

Conducts a comprehensive accessibility audit following WCAG 2.1 guidelines, identifying barriers for users with disabilities and providing actionable remediation guidance.

## Usage Examples

```
# Run full accessibility audit on a website
/accessibility-check https://stripe.com

# Audit local HTML file
/accessibility-check --file ./index.html

# Focus on specific accessibility areas
/accessibility-check https://example.com --focus color-contrast,keyboard,screen-reader

# Generate HTML report with screenshots
/accessibility-check https://my-site.com --output ./accessibility-report.html --format html --screenshots

# Test specific WCAG level
/accessibility-check https://site.com --level AAA --interactive

# Audit for mobile accessibility
/accessibility-check https://mobile-site.com --viewport 375x667
```

## Audit Methodology

### Automated Testing

The audit combines multiple testing approaches:

1. **Browser Automation**: Uses Playwright to simulate real user interactions
2. **Static Analysis**: Parses HTML structure and semantic elements
3. **Visual Analysis**: Captures screenshots and analyzes visual accessibility
4. **Interactive Testing**: Simulates keyboard navigation and screen reader usage

### Testing Environments

- **Multiple Viewports**: Tests on desktop, tablet, and mobile viewports
- **Various Browsers**: Chrome, Firefox, Safari compatibility testing
- **Assistive Technologies**: Screen reader and keyboard navigation simulation
- **Color Spaces**: Tests for color blindness and low vision scenarios

## Success Criteria Evaluation

### Principle 1: Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

#### 1.1 Text Alternatives

- **1.1.1 Non-text Content**: All images, icons, and media have appropriate text alternatives
- **1.1.2 Audio-only and Video-only**: Multimedia content has text alternatives
- **1.1.3 Captions**: Video content includes synchronized captions
- **1.1.4 Audio Description**: Video content includes audio descriptions

#### 1.2 Time-based Media

- **1.2.1 Audio-only**: Audio content has text alternatives
- **1.2.2 Captions**: Video content has captions
- **1.2.3 Audio Description**: Video content has audio descriptions

#### 1.3 Adaptable

- **1.3.1 Info and Relationships**: Information conveyed through presentation is available programmatically
- **1.3.2 Meaningful Sequence**: Reading and navigation order is logical
- **1.3.3 Sensory Characteristics**: Instructions don't rely solely on sensory characteristics

#### 1.4 Distinguishable

- **1.4.1 Use of Color**: Color is not used as the only visual means of conveying information
- **1.4.2 Audio Control**: Audio content can be controlled by the user
- **1.4.3 Contrast (Minimum)**: Text and images have sufficient contrast
- **1.4.4 Resize Text**: Text can be resized up to 200% without loss of content
- **1.4.5 Images of Text**: Images of text are avoided when possible

### Principle 2: Operable

User interface components and navigation must be operable.

#### 2.1 Keyboard Accessible

- **2.1.1 Keyboard**: All functionality is available from a keyboard
- **2.1.2 No Keyboard Trap**: Keyboard focus is not trapped in any part of content
- **2.1.3 Keyboard (No Exception)**: All functionality is operable through keyboard interface

#### 2.2 Enough Time

- **2.2.1 Timing Adjustable**: Users can adjust time limits
- **2.2.2 Pause, Stop, Hide**: Users can pause or stop moving content
- **2.2.3 No Timing**: No time limits for user actions

#### 2.3 Seizures and Physical Reactions

- **2.3.1 Three Flashes or Below**: Content doesn't flash more than 3 times per second
- **2.3.2 Three Flashes**: No content flashes in the 3-50 Hz range

#### 2.4 Navigable

- **2.4.1 Bypass Blocks**: Mechanism to bypass repeated content
- **2.4.2 Page Titled**: Pages have descriptive titles
- **2.4.3 Focus Order**: Focus moves in meaningful sequence
- **2.4.4 Link Purpose**: Link purpose is clear from context
- **2.4.5 Multiple Ways**: Multiple ways to locate content
- **2.4.6 Headings and Labels**: Headings and labels are descriptive
- **2.4.7 Focus Visible**: Keyboard focus indicator is visible

### Principle 3: Understandable

Information and operation of user interface must be understandable.

#### 3.1 Readable

- **3.1.1 Language of Page**: Primary language is identified
- **3.1.2 Language of Parts**: Language changes are identified
- **3.1.3 Unusual Words**: Unusual words are explained
- **3.1.4 Abbreviations**: Abbreviations are expanded
- **3.1.5 Reading Level**: Content is written at appropriate reading level
- **3.1.6 Pronunciation**: Pronunciation is provided for unusual words

#### 3.2 Predictable

- **3.2.1 On Focus**: Focus doesn't trigger unexpected changes
- **3.2.2 On Input**: Input doesn't trigger unexpected changes
- **3.2.3 Consistent Navigation**: Navigation is consistent
- **3.2.4 Consistent Identification**: Components are identified consistently

#### 3.3 Input Assistance

- **3.3.1 Error Identification**: Errors are clearly identified
- **3.3.2 Labels or Instructions**: Labels and instructions are provided
- **3.3.3 Error Suggestion**: Error suggestions are provided
- **3.3.4 Error Prevention**: Error prevention mechanisms are in place

### Principle 4: Robust

Content must be robust enough to be interpreted by a wide variety of user agents.

#### 4.1 Compatible

- **4.1.1 Parsing**: Markup is well-formed and parsable
- **4.1.2 Name, Role, Value**: Name, role, and value are programmatically determinable
- **4.1.3 Status Messages**: Status messages are programmatically determinable

## Automated Test Results

### Color Contrast Analysis

```json
{
  "colorContrast": {
    "passed": 87,
    "failed": 13,
    "issues": [
      {
        "element": ".hero-title",
        "foreground": "#6B7280",
        "background": "#F9FAFB",
        "ratio": 3.2,
        "required": 4.5,
        "suggestion": "Increase contrast by darkening text to #374151"
      }
    ]
  }
}
```

### Keyboard Navigation Testing

```json
{
  "keyboardNavigation": {
    "focusableElements": 42,
    "tabOrder": "logical",
    "skipLinks": true,
    "focusVisible": true,
    "issues": [
      {
        "element": ".custom-dropdown",
        "issue": "Not keyboard accessible",
        "suggestion": "Add keyboard event handlers for Arrow keys and Enter"
      }
    ]
  }
}
```

### Screen Reader Compatibility

```json
{
  "screenReader": {
    "semanticStructure": "good",
    "ariaLabels": "partial",
    "liveRegions": "missing",
    "issues": [
      {
        "element": ".notification",
        "issue": "Dynamic content not announced",
        "suggestion": "Add aria-live='polite' to notification container"
      }
    ]
  }
}
```

## Issue Classification

### Critical Issues (Must Fix)

- **Missing Alt Text**: Images without alternative text
- **Keyboard Inaccessible**: Critical functions not keyboard operable
- **Poor Color Contrast**: < 3:1 contrast ratio
- **Missing Form Labels**: Form controls without labels
- **No Focus Indicators**: Invisible keyboard focus

### Serious Issues (Should Fix)

- **Inconsistent Navigation**: Confusing navigation patterns
- **Missing Landmarks**: No header, main, navigation landmarks
- **Color Contrast**: 3:1-4.5:1 contrast ratio
- **Link Purpose Unclear**: Ambiguous link purposes
- **Heading Hierarchy**: Skipped heading levels

### Moderate Issues (Consider Fixing)

- **Redundant Links**: Unnecessary repeated links
- **Inconsistent Icons**: Icons without consistent meaning
- **Missing Form Instructions**: Forms without clear instructions
- **Generic Page Titles**: Non-descriptive page titles
- **Missing Language Attribute**: No lang attribute

### Minor Issues (Nice to Have)

- **Button Labels**: Unclear button purposes
- **Table Headers**: Missing table headers
- **Video Captions**: Videos without captions
- **Consistent Terminology**: Inconsistent link text
- **Page Structure**: Minor semantic improvements

## Remediation Guidance

### Critical Issues Fixes

#### 1. Add Alternative Text

```html
<!-- Incorrect -->
<img src="logo.png" />

<!-- Correct -->
<img src="logo.png" alt="Company Logo" />

<!-- For decorative images -->
<img src="decorative.png" alt="" />
```

#### 2. Fix Color Contrast

```css
/* Calculate new color with better contrast */
.hero-title {
  color: #1f2937; /* Was #6B7280 */
  background: #f9fafb;
  /* Contrast ratio: 7.2:1 (meets AA standard) */
}
```

#### 3. Add Keyboard Support

```javascript
function handleKeyDown(event) {
  switch (event.key) {
    case "Enter":
    case " ":
      event.preventDefault();
      handleClick();
      break;
    case "ArrowDown":
      event.preventDefault();
      openDropdown();
      break;
  }
}
```

### Serious Issues Fixes

#### 1. Add Semantic Landmarks

```html
<header role="banner">
  <nav role="navigation" aria-label="Main navigation">
    <!-- Navigation content -->
  </nav>
</header>

<main role="main">
  <!-- Main content -->
</main>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

#### 2. Improve Focus Indicators

```css
/* Visible focus indicators */
.button:focus,
.link:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .button:focus {
    outline: 3px solid #000000;
  }
}
```

#### 3. Add ARIA Labels

```html
<!-- For custom components -->
<div role="button" tabindex="0" aria-label="Close dialog">✕</div>

<!-- For form controls -->
<label for="email">Email Address</label>
<input type="email" id="email" aria-describedby="email-help" />
<span id="email-help">We'll use this to send you updates</span>
```

## Report Formats

### JSON Report Structure

```json
{
  "audit": {
    "url": "https://example.com",
    "timestamp": "2024-01-01T00:00:00Z",
    "wcagVersion": "2.1",
    "conformanceLevel": "AA",
    "testingTool": "accessibility-auditor"
  },
  "summary": {
    "score": 0.87,
    "grade": "B",
    "issues": {
      "critical": 3,
      "serious": 8,
      "moderate": 15,
      "minor": 22
    },
    "compliance": {
      "perceivable": 0.92,
      "operable": 0.85,
      "understandable": 0.88,
      "robust": 0.95
    }
  },
  "issues": [
    {
      "id": "alt-text-missing-001",
      "type": "critical",
      "wcag": "1.1.1",
      "element": "img[src='/hero-image.jpg']",
      "description": "Hero image missing alt text",
      "impact": "Screen reader users cannot understand hero content",
      "suggestion": "Add alt='Modern web development solutions' to img element",
      "code": "<img src='/hero-image.jpg' alt='Modern web development solutions' />",
      "helpUrl": "https://www.w3.org/WAI/tutorials/images/"
    }
  ],
  "automatedTests": {
    "colorContrast": {
      "score": 0.89,
      "total": 45,
      "passed": 40,
      "failed": 5
    },
    "keyboardNavigation": {
      "score": 0.95,
      "focusableElements": 28,
      "logicalTabOrder": true
    },
    "screenReader": {
      "score": 0.82,
      "semanticElements": 15,
      "ariaLabels": 12
    }
  },
  "recommendations": [
    {
      "priority": "high",
      "category": "color-contrast",
      "action": "Fix color contrast ratios",
      "description": "5 elements have insufficient color contrast",
      "impact": "Affects users with visual impairments",
      "effort": "Medium"
    }
  ],
  "metadata": {
    "testing": {
      "browser": "chromium",
      "viewport": "1440x900",
      "userAgent": "accessibility-auditor/1.0"
    },
    "performance": {
      "auditTime": "45.2s",
      "pagesCrawled": 12,
      "elementsAnalyzed": 1247
    }
  }
}
```

### HTML Report Features

- **Visual Screenshots**: Annotated screenshots showing issues
- **Interactive Elements**: Clickable elements to view details
- **Severity Filtering**: Filter issues by severity level
- **Code Examples**: Copy-paste ready fix examples
- **Progress Tracking**: Track remediation progress over time

### CSV Export

- **Issue Tracking**: Import into project management tools
- **Bulk Analysis**: Analyze multiple audits across time
- **Compliance Reporting**: Generate compliance reports for stakeholders

## Integration Options

### CI/CD Integration

```yaml
# .github/workflows/accessibility.yml
name: Accessibility Audit
on: [push, pull_request]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install
      - run: npm run build
      - run: npx accessibility-check http://localhost:3000 --output ./reports/accessibility.json
      - uses: actions/upload-artifact@v2
        with:
          name: accessibility-report
          path: ./reports/
```

### Development Tools Integration

- **ESLint Rules**: Custom ESLint rules for accessibility
- **Pre-commit Hooks**: Run accessibility checks before commits
- **Browser Extensions**: Real-time accessibility feedback
- **IDE Plugins**: Accessibility linting in development environment

## Success Metrics

### Quantitative Metrics

- **WCAG Compliance Score**: Percentage of criteria met
- **Issue Resolution Rate**: Speed of fixing identified issues
- **Automated Test Coverage**: Percentage of site tested
- **User Impact Assessment**: Reach of accessibility improvements

### Qualitative Metrics

- **User Experience**: Feedback from users with disabilities
- **Developer Experience**: Ease of implementing recommendations
- **Business Impact**: Effect on user engagement and legal compliance
- **Stakeholder Satisfaction**: Satisfaction with accessibility efforts

## Best Practices

### Testing Strategy

1. **Regular Audits**: Include in development workflow
2. **Multiple Viewports**: Test on desktop, tablet, mobile
3. **Various Browsers**: Chrome, Firefox, Safari, Edge
4. **Assistive Technologies**: Screen readers, keyboard navigation
5. **User Testing**: Include users with disabilities in testing

### Remediation Process

1. **Prioritize Critical Issues**: Fix critical issues first
2. **Develop Standards**: Create accessibility guidelines
3. **Training**: Educate development team on accessibility
4. **Monitoring**: Track accessibility metrics over time
5. **Continuous Improvement**: Learn from each audit cycle

### Legal Compliance

1. **WCAG Standards**: Meet legal accessibility requirements
2. **Documentation**: Maintain accessibility documentation
3. **Audits**: Regular third-party accessibility audits
4. **Reporting**: Report accessibility status to stakeholders
5. **Training**: Ongoing accessibility training programs

## Troubleshooting

### Common Issues

- **Dynamic Content**: Use proper ARIA live regions
- **Custom Components**: Ensure keyboard and screen reader support
- **Complex Interactions**: Break down into simple, accessible patterns
- **Third-party Content**: Ensure third-party components are accessible
- **Mobile Optimization**: Test touch targets and mobile interactions

### Performance Considerations

- **Audit Speed**: Large sites may take longer to audit
- **Resource Usage**: Audits consume browser resources
- **Network Impact**: Consider impact on production sites
- **Caching**: Implement caching for repeated audits

## Support and Resources

### Help Resources

- **WCAG Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Practices**: https://www.w3.org/WAI/ARIA/apg/
- **Color Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Accessibility Testing Tools**: https://www.w3.org/WAI/test-evaluate/tools/

### Community Support

- **Web Accessibility Initiative**: https://www.w3.org/WAI/
- **A11Y Project**: https://www.a11yproject.com/
- **Inclusive Design**: https://inclusivedesignprinciples.org/
- **Accessibility Resources**: https://a11yresources.webflow.com/

## Future Enhancements

### Advanced Features

- **AI-Powered Analysis**: Machine learning for issue detection
- **User Journey Testing**: Test complete user workflows
- **Performance Impact**: Measure accessibility fix performance impact
- **Automated Remediation**: Auto-fix simple accessibility issues

### Integration Improvements

- **Real-time Feedback**: Browser extension for real-time feedback
- **Design System Integration**: Accessibility checks in design tools
- **Component Libraries**: Pre-tested accessible component libraries
- **Training Modules**: Interactive accessibility training modules</contents>
  </xai:function_call">
