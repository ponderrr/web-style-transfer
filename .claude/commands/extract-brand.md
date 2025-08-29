---
command: extract-brand
description: Extract brand identity, content, and voice from a website
parameters:
  - url: Target website URL to extract brand from
  - output: Output file path (optional, defaults to specs/content/site-content.json)
  - max-pages: Maximum pages to crawl (optional, defaults to 50)
  - delay: Delay between requests in milliseconds (optional, defaults to 1000)
  - verbose: Enable verbose logging (optional, default: false)
  - respect-robots: Respect robots.txt (optional, default: true)
  - no-respect-robots: Ignore robots.txt (optional)
  - include-images: Download and analyze images (optional, default: false)
  - depth: Crawling depth limit (optional, default: 3)
  - focus: Focus areas (optional, comma-separated: brand,content,voice,seo,tech)
---

Extracts comprehensive brand identity, content structure, voice patterns, and technical implementation from any website. This creates a complete brand profile that can be used to regenerate websites while preserving the original brand essence.

## Usage Examples

```
/extract-brand https://stripe.com
/extract-brand https://mycompany.com --output ./custom/brand.json --max-pages 25
/extract-brand https://example.com --verbose --include-images
/extract-brand https://site.com --focus brand,voice --depth 2
/extract-brand https://company.com --delay 2000 --no-respect-robots
```

## Extraction Process

### Phase 1: Initial Site Analysis

1. **Homepage Assessment**: Analyze landing page for brand presence
2. **Site Structure Mapping**: Crawl navigation and identify key pages
3. **Content Inventory**: Catalog all content types and topics
4. **Technical Assessment**: Evaluate technology stack and implementation

### Phase 2: Brand Identity Extraction

1. **Company Information**: Extract name, tagline, mission, values
2. **Visual Identity**: Analyze color palette, typography, logo usage
3. **Brand Voice**: Study writing style, tone, and messaging patterns
4. **Personality Traits**: Identify brand character and communication style

### Phase 3: Content Analysis

1. **Content Strategy**: Map content types, formats, and distribution
2. **Information Architecture**: Analyze site structure and navigation
3. **User Experience**: Study conversion paths and user flows
4. **SEO Optimization**: Extract meta tags, keywords, structured data

### Phase 4: Voice & Tone Analysis

1. **Writing Style**: Analyze sentence structure, vocabulary choice
2. **Communication Patterns**: Study CTAs, error messages, help text
3. **Audience Adaptation**: Identify different audience segments
4. **Consistency Check**: Verify brand voice consistency across pages

## What Gets Extracted

### 🎯 Brand Identity

- **Company Name**: Primary brand identifier and variations
- **Tagline/Mission**: Core brand messaging and value proposition
- **Logo & Visual Assets**: Brand imagery and iconography
- **Color Palette**: Brand colors and their usage patterns
- **Typography**: Font choices and typographic hierarchy

### 📝 Content Strategy

- **Content Types**: Blog posts, case studies, whitepapers, videos
- **Content Topics**: Primary subject areas and expertise domains
- **Publishing Patterns**: Content frequency and format preferences
- **Audience Segmentation**: Different audience types and their content

### 🎨 Brand Voice & Personality

- **Tone**: Professional, friendly, technical, inspirational
- **Style**: Formal, conversational, expert, educational
- **Language Patterns**: Vocabulary preferences and writing style
- **Communication Guidelines**: Brand voice rules and exceptions

### 🏗️ Information Architecture

- **Site Structure**: Navigation hierarchy and page organization
- **User Flows**: Primary conversion paths and user journeys
- **Content Relationships**: How different content types connect
- **Search Patterns**: Internal search and filtering systems

### 🔍 SEO & Technical

- **Meta Information**: Title tags, descriptions, keywords
- **Structured Data**: Schema markup and rich snippets
- **Performance Indicators**: Loading speed and optimization features
- **Mobile Optimization**: Responsive design and mobile features

## Output Structure

### Brand Extraction Result

```json
{
  "url": "https://example.com",
  "timestamp": "2024-01-01T00:00:00Z",
  "extraction": {
    "duration": 45000,
    "pagesAnalyzed": 25,
    "contentTypes": {
      "html": 25,
      "images": 45,
      "documents": 8
    },
    "success": true
  },
  "brand": {
    "name": "Example Company",
    "tagline": "Building amazing solutions",
    "mission": "To empower businesses with innovative technology",
    "values": ["Innovation", "Quality", "Customer Focus"],
    "personality": ["Professional", "Approachable", "Expert"],
    "targetAudience": "Small to medium businesses seeking technology solutions",
    "uniqueValue": "We combine technical expertise with customer-centric design"
  },
  "voice": {
    "tone": "professional",
    "style": "conversational",
    "language": ["solution", "innovative", "customer-focused", "results-driven"],
    "avoid": ["cheap", "fast", "easy"],
    "guidelines": [
      "Use active voice whenever possible",
      "Focus on customer benefits over features",
      "Keep sentences under 25 words"
    ]
  },
  "content": {
    "types": ["blog", "case-studies", "whitepapers", "webinars"],
    "topics": ["technology", "business", "innovation", "digital-transformation"],
    "formats": ["long-form", "video", "infographics", "podcasts"],
    "publishing": {
      "frequency": "weekly",
      "style": "educational",
      "length": "800-1200 words"
    }
  },
  "architecture": {
    "structure": {
      "homepage": "/",
      "about": "/about",
      "services": "/services",
      "blog": "/blog",
      "contact": "/contact"
    },
    "navigation": [
      { "label": "Home", "href": "/", "children": [] },
      { "label": "Services", "href": "/services", "children": [...] },
      { "label": "About", "href": "/about", "children": [] },
      { "label": "Blog", "href": "/blog", "children": [] },
      { "label": "Contact", "href": "/contact", "children": [] }
    ],
    "userFlows": [
      {
        "name": "Lead Generation",
        "steps": ["Visit homepage", "Learn about services", "Download whitepaper", "Contact sales"]
      },
      {
        "name": "Content Consumption",
        "steps": ["Visit blog", "Read article", "Subscribe to newsletter", "Download resource"]
      }
    ]
  },
  "seo": {
    "meta": {
      "title": "Example Company - Technology Solutions",
      "description": "Leading provider of innovative technology solutions for businesses",
      "keywords": ["technology", "solutions", "business", "innovation"]
    },
    "structuredData": {
      "@type": "Organization",
      "name": "Example Company",
      "url": "https://example.com",
      "logo": "https://example.com/logo.png"
    },
    "performance": {
      "score": 85,
      "metrics": {
        "speed": "fast",
        "mobile": true,
        "https": true
      }
    }
  },
  "contentInventory": {
    "pages": [
      {
        "url": "/",
        "title": "Home - Example Company",
        "type": "homepage",
        "wordCount": 450,
        "topics": ["company", "services", "value-proposition"],
        "sentiment": "positive",
        "readingTime": 2
      },
      {
        "url": "/about",
        "title": "About Us - Example Company",
        "type": "about",
        "wordCount": 800,
        "topics": ["mission", "team", "history"],
        "sentiment": "professional",
        "readingTime": 4
      }
    ],
    "contentTypes": {
      "blog-posts": 25,
      "case-studies": 8,
      "whitepapers": 12,
      "videos": 5,
      "infographics": 3
    },
    "topics": [
      { "topic": "technology", "frequency": 45, "pages": ["/blog/tech-trends", "/services/tech-consulting"] },
      { "topic": "business", "frequency": 38, "pages": ["/blog/business-growth", "/case-studies/business-transformation"] },
      { "topic": "innovation", "frequency": 32, "pages": ["/about", "/blog/innovation-strategy"] }
    ],
    "keywords": [
      { "word": "technology", "frequency": 78, "relevance": 0.9 },
      { "word": "solutions", "frequency": 65, "relevance": 0.8 },
      { "word": "business", "frequency": 52, "relevance": 0.7 }
    ],
    "readability": {
      "averageWordsPerPage": 650,
      "averageSentencesPerParagraph": 3.2,
      "averageSyllablesPerWord": 1.8,
      "fleschKincaidGrade": 8.5
    }
  },
  "technical": {
    "platform": "WordPress",
    "framework": "React",
    "analytics": ["Google Analytics", "Hotjar"],
    "cdn": "Cloudflare",
    "hosting": "AWS",
    "security": {
      "https": true,
      "sslCertificate": "valid",
      "securityHeaders": ["HSTS", "CSP", "X-Frame-Options"]
    },
    "performance": {
      "pageSpeed": 85,
      "coreWebVitals": {
        "fcp": 1800,
        "lcp": 2500,
        "tti": 3800,
        "tbt": 300,
        "cls": 0.08
      }
    }
  },
  "recommendations": [
    "Strengthen brand voice consistency across all content",
    "Improve internal linking structure for better SEO",
    "Add more customer testimonials to build trust",
    "Optimize images for better loading performance"
  ],
  "qualityScore": {
    "brandClarity": 0.88,
    "contentQuality": 0.82,
    "informationArchitecture": 0.91,
    "seoOptimization": 0.79,
    "messagingConsistency": 0.85,
    "technicalImplementation": 0.86,
    "overall": 0.85
  }
}
```

## Configuration Options

### Crawling Parameters

```bash
# Limit crawling scope
/extract-brand https://site.com --max-pages 10 --depth 2

# Respect website limits
/extract-brand https://site.com --delay 3000 --respect-robots

# Include visual analysis
/extract-brand https://site.com --include-images --verbose
```

### Focus Areas

```bash
# Brand-focused extraction
/extract-brand https://site.com --focus brand

# Content strategy analysis
/extract-brand https://site.com --focus content,voice

# Technical and SEO focus
/extract-brand https://site.com --focus seo,tech
```

## Intelligent Analysis Features

### Brand Voice Detection

- **Tone Analysis**: Detects formal, casual, technical, inspirational tones
- **Style Patterns**: Identifies writing style and communication preferences
- **Vocabulary Mining**: Extracts brand-specific terminology and phrases
- **Consistency Scoring**: Measures brand voice consistency across pages

### Content Strategy Mapping

- **Topic Clustering**: Groups related content into topic categories
- **Content Gaps**: Identifies missing content areas
- **Audience Segmentation**: Detects different audience types and their content preferences
- **Publishing Patterns**: Analyzes content frequency and format preferences

### User Experience Analysis

- **Conversion Paths**: Maps primary user journeys and conversion funnels
- **Pain Points**: Identifies user experience issues and friction points
- **Success Metrics**: Analyzes goal completion and user engagement patterns
- **Mobile Experience**: Evaluates mobile usability and touch interactions

## Quality Assessment

### Brand Clarity Score

- **Name Recognition**: How clearly the brand name is presented
- **Value Proposition**: Clarity of what the company offers
- **Target Audience**: How well the audience is defined and addressed
- **Unique Positioning**: Differentiation from competitors

### Content Quality Score

- **Information Value**: Usefulness and accuracy of content
- **Readability**: Ease of understanding and scanning
- **Engagement**: Content's ability to maintain reader interest
- **Freshness**: Currency and relevance of information

### Information Architecture Score

- **Navigation Clarity**: Ease of finding information
- **Content Organization**: Logical grouping and hierarchy
- **Search Functionality**: Effectiveness of search and filtering
- **Mobile Navigation**: Mobile-friendly navigation patterns

### SEO Optimization Score

- **Keyword Optimization**: Effective use of target keywords
- **Meta Information**: Quality of title tags and descriptions
- **Technical SEO**: Site speed, mobile-friendliness, security
- **Content Structure**: Heading hierarchy and semantic HTML

### Messaging Consistency Score

- **Voice Consistency**: Uniformity of brand voice across pages
- **Visual Consistency**: Consistent use of brand elements
- **Messaging Alignment**: Agreement between different communication channels
- **Brand Guidelines**: Adherence to established brand standards

### Technical Implementation Score

- **Performance**: Loading speed and optimization
- **Security**: HTTPS, security headers, data protection
- **Mobile Optimization**: Responsive design and mobile features
- **Accessibility**: Basic accessibility compliance

## Integration with Style Transfer

### Design Compatibility Analysis

- **Color Harmony**: How well brand colors work with design systems
- **Typography Matching**: Compatibility between brand and design fonts
- **Visual Language**: Alignment between brand imagery and design patterns
- **Style Consistency**: Coherence between brand personality and design aesthetics

### Content-System Alignment

- **Component Fit**: How well existing content fits design components
- **Layout Requirements**: Design adaptations needed for content types
- **User Flow Integration**: How brand user flows work with design patterns
- **Brand Preservation**: Ensuring brand identity survives design transfer

## Error Handling

### Network Issues

- **Connection Timeouts**: Automatic retry with exponential backoff
- **Rate Limiting**: Polite crawling with configurable delays
- **Blocked Requests**: Respect robots.txt and website policies
- **Content Loading**: Wait for dynamic content and SPAs

### Content Analysis Issues

- **Encoding Problems**: Handle different character encodings
- **Malformed HTML**: Robust parsing with error recovery
- **Missing Content**: Graceful handling of empty or placeholder pages
- **Language Barriers**: Detection of non-primary language content

### Data Quality Issues

- **Sparse Content**: Minimum viable analysis with available data
- **Inconsistent Branding**: Analysis of brand inconsistencies
- **Technical Barriers**: Work around anti-scraping measures
- **Incomplete Information**: Partial analysis with confidence scoring

## Best Practices

### Ethical Extraction

1. **Respect Website Policies**: Always honor robots.txt directives
2. **Minimize Server Impact**: Use reasonable request rates and delays
3. **Don't Overload Services**: Limit concurrent requests and crawling depth
4. **Transparent Process**: Clearly identify as automated analysis tool

### Quality Optimization

1. **Comprehensive Coverage**: Analyze multiple pages for complete brand picture
2. **Context Preservation**: Maintain relationship between different content elements
3. **Brand Authenticity**: Preserve original brand voice and personality
4. **Technical Accuracy**: Ensure technical assessments are current and accurate

### Data Validation

1. **Cross-reference Information**: Verify brand details across multiple pages
2. **Consistency Checks**: Validate brand voice consistency
3. **Quality Thresholds**: Apply minimum quality standards for extraction
4. **Confidence Scoring**: Provide confidence levels for extracted information

## Troubleshooting

### Common Issues

- **Anti-bot Measures**: May require manual intervention or different approach
- **Dynamic Content**: Some SPAs may require additional waiting time
- **Large Sites**: Use depth limits and page limits for focused analysis
- **Encoding Issues**: May need manual handling of non-UTF8 content

### Optimization Tips

- **Focus Areas**: Use specific focus flags to reduce analysis scope
- **Page Limits**: Set appropriate page limits for site size
- **Delay Settings**: Adjust delays based on website responsiveness
- **Verbose Mode**: Use verbose logging to debug extraction issues

## Advanced Usage

### Multi-site Brand Analysis

```bash
# Compare brand presence across multiple domains
/extract-brand https://company.com --output ./brand-main.json
/extract-brand https://blog.company.com --output ./brand-blog.json
/extract-brand https://careers.company.com --output ./brand-careers.json
```

### Industry Benchmarking

```bash
# Compare against industry standards
/extract-brand https://competitor1.com --output ./competitor1.json
/extract-brand https://competitor2.com --output ./competitor2.json
# Then compare with your brand analysis
```

### Content Strategy Planning

```bash
# Deep content analysis for strategy planning
/extract-brand https://site.com --focus content,voice --max-pages 100 --include-images
```

## Performance Considerations

### Extraction Speed

- **Typical Sites**: 30-60 seconds for comprehensive analysis
- **Large Sites**: 2-5 minutes with page limits
- **Content-heavy Sites**: Additional time for content analysis
- **Image Analysis**: Significant time increase with image processing

### Resource Usage

- **Memory**: 100-500MB depending on site complexity
- **Network**: Minimal bandwidth usage with caching
- **Disk**: 1-10MB for extracted data and analysis
- **CPU**: Moderate CPU usage for content analysis

## Security & Privacy

### Data Protection

- **No Personal Data**: Never extract or store personal information
- **Secure Storage**: All extracted data stored locally
- **No External Transmission**: Analysis performed entirely offline
- **Privacy Compliance**: Respect privacy policies and regulations

### Ethical Guidelines

- **Public Content Only**: Only analyze publicly available information
- **No Login Bypass**: Respect authentication and access controls
- **Rate Limiting**: Always use reasonable request frequencies
- **Resource Respect**: Minimize impact on website performance

## Integration Examples

### With Design Transfer Workflow

```bash
# Extract brand from existing site
/extract-brand https://old-website.com --output ./brand.json

# Extract design from modern reference
/extract-style https://modern-site.com --output ./design.json

# Compose unified specification
/compose-spec ./design.json ./brand.json --output ./spec.json

# Generate new website
/build-site ./spec.json --output ./new-website
```

### Content Strategy Planning

```bash
# Analyze content strategy
/extract-brand https://competitor.com --focus content,voice --max-pages 50

# Generate content recommendations
# Use extracted data for content planning and strategy development
```

### Brand Monitoring

```bash
# Regular brand analysis
/extract-brand https://company.com --output ./brand-$(date +%Y%m%d).json

# Compare with previous analyses
# Track brand consistency and content strategy changes over time
```

## Success Metrics

### Extraction Quality

- **Completeness**: >90% of brand elements successfully identified
- **Accuracy**: >95% accuracy in brand information extraction
- **Consistency**: >85% brand voice consistency across analyzed pages
- **Actionability**: >90% of extracted information useful for regeneration

### Analysis Depth

- **Content Coverage**: Average 85% of website content analyzed
- **Brand Clarity**: Average 82% brand clarity score
- **Voice Consistency**: Average 78% brand voice consistency
- **Technical Assessment**: Average 88% technical implementation quality

## Future Enhancements

### AI-Powered Analysis

- **Sentiment Analysis**: Advanced brand sentiment detection
- **Competitor Comparison**: Automated competitor brand analysis
- **Trend Detection**: Emerging brand and content trends
- **Personalization**: Audience-specific brand analysis

### Advanced Integration

- **CMS Integration**: Direct integration with content management systems
- **Design Tool Sync**: Automatic sync with Figma, Sketch, Adobe XD
- **Analytics Integration**: Connection with Google Analytics, Mixpanel
- **Social Media Analysis**: Brand presence across social platforms

### Real-time Monitoring

- **Brand Health Dashboard**: Continuous brand monitoring
- **Content Freshness**: Automated content freshness tracking
- **SEO Performance**: Ongoing SEO performance monitoring
- **User Experience Tracking**: Real-time user experience metrics

---

**Note**: Brand extraction is designed to preserve and enhance your brand identity while enabling modern website regeneration. Always review extracted information for accuracy and brand consistency before using in production.
