# Development Prompt: Tamil Traditional Interactive Wedding Invitation

Create a **beautiful, immersive, responsive interactive wedding invitation webpage** for **ArunBalan weds Subhashini**. Use the overall interaction pattern and storytelling flow of the reference invitation at [Just Evites — Kanna & Rakshna](https://justevites.com/pages/kanna-and-rakshna), but do **not** copy its visual identity, wording, assets, or layout exactly. Reimagine the experience as a premium **Tamil traditional temple-style invitation** with cinematic parallax motion, elegant South Indian cultural details, and a warm, celebratory atmosphere.

## Core Experience

The webpage should feel like opening a handcrafted Tamil wedding invitation. It begins with a dreamy closed envelope, asks the guest for their name, and then uses that name throughout the invitation. After the guest submits their name, the envelope should slowly open through a graceful multi-step animation and transition into the main invitation. The page should be optimized for mobile first, while also looking refined on tablet and desktop.

The experience must be accessible, performant, and easy to customize. Use semantic HTML, responsive CSS, smooth but lightweight animations, keyboard-accessible controls, visible focus states, reduced-motion support, and meaningful alternative text for all meaningful images.

## Visual Direction

Use a **Tamil temple-inspired visual language** rather than a generic wedding template. The design should combine:

- A deep **maroon, vermilion, antique gold, sandalwood, and ivory** color palette.
- A subtle textured background inspired by handmade invitation paper, silk, or temple walls.
- Decorative motifs such as **gopuram silhouettes, kuthuvilakku lamps, mango leaves, lotus flowers, jasmine garlands, kolam linework, temple bells, thoranam, and traditional South Indian ornamental borders**.
- Fine gold line illustrations and ornamental separators, used sparingly so the page remains elegant rather than crowded.
- Typography pairing: a refined serif or classical display face for the couple’s names, complemented by a highly readable sans-serif or Tamil-compatible font for supporting text. If Tamil script is used, select a font with excellent Tamil glyph coverage and legibility.
- Gentle floating particles resembling flower petals, tiny golden dust, or soft lamp-light specks. Keep them subtle and avoid distracting from the invitation content.
- A visual tone that is **dreamy, devotional, intimate, premium, and festive**.

Do not use overly bright gradients, generic stock wedding clichés, excessive glitter, or fast animations. The design should resemble a luxury printed Tamil wedding card brought to life digitally.

## Section 1: Dreamy Envelope Entry Screen

Create a full-screen opening scene with a centered, closed wedding envelope resting on a softly illuminated temple-inspired background. The envelope should look tactile and premium, with ivory or muted cream paper, a maroon inner lining, antique-gold edging, and a traditional seal featuring a lotus, lamp, or stylized Tamil wedding emblem.

Above or behind the envelope, include a subtle temple arch or gopuram silhouette with a soft golden glow. Add a very slow parallax movement to the background ornaments and a gentle floating-petal effect.

Display the following copy:

> **Vanakkam**
>
> Please enter your name to open the invitation

Provide a clearly labeled text input with the placeholder **“Your Name”**. Add a primary button labeled **“Open Invitation”**. The button should look like a small antique-gold plaque or temple inscription panel.

The guest name is required. If the user tries to continue without entering a name, show a graceful inline validation message such as **“Please enter your name to continue.”** Do not use an intrusive browser alert.

## Envelope Opening Animation

When the guest submits a valid name, animate the envelope slowly and ceremonially:

1. The button briefly changes to a loading or opening state.
2. The wax or ornamental seal gently glows and dissolves.
3. The envelope flap lifts with realistic easing.
4. A cream invitation card rises from the envelope.
5. The card unfolds or expands toward the viewer with a soft golden light.
6. The opening scene fades or transforms into the main invitation while preserving the guest’s name in state.
7. Automatically scroll or transition to the hero section only after the animation completes.

The entire animation should feel smooth and unhurried, approximately 2–4 seconds, with no abrupt jump. Respect `prefers-reduced-motion`: for users who prefer reduced motion, replace the full animation with a short fade and scale transition. Ensure the animation does not trap keyboard focus.

## Section 2: Main Hero Invitation

Create a grand hero section that feels like the cover of a traditional Tamil wedding invitation. Include a layered parallax composition:

- A distant temple gopuram or mandapam silhouette.
- A middle layer of mango-leaf thoranam, hanging bells, floral garlands, or carved pillars.
- A foreground layer containing kolam-inspired linework, lamp flames, flower petals, and subtle gold particles.
- A central ivory invitation-card panel or silk-texture area with a refined ornamental border.

Display the main content prominently:

> **ArunBalan**
>
> **weds**
>
> **Subhashini**
>
> **Are beginning forever**
>
> **Coimbatore**

Correct the phrasing visually and grammatically to **“A beginning to forever”** or **“Beginning forever together”**, unless the couple explicitly wants the original wording **“Are beginning forever.”** Preserve the requested idea while making the final copy feel polished.

Use a large classical display treatment for the couple’s names, with “weds” presented as a smaller gold ornamental word between them. Include a small decorative line or Tamil-style symbol between the hero copy and the location.

Add a compact scroll cue such as **“Scroll to witness our beginning”** with a small animated downward arrow or lamp motif.

## Section 3: Personalized Countdown

Create a visually rich countdown section that introduces the guest by name. Display:

> **We can’t wait to see you, {guestName}**

Replace `{guestName}` dynamically with the value entered in the opening screen. Sanitize the value before rendering it to prevent HTML injection, and preserve it across the page session if appropriate.

Place a beautiful couple or wedding-related image beside or behind the countdown. The image should be presented within a traditional ornamental frame, temple arch, or rounded card with gold detailing. Use a placeholder asset if final photography is not yet available, but structure the code so the image can be replaced easily.

Show a live countdown with four units:

| Unit | Label |
|---|---|
| Days | `DAYS` |
| Hours | `HOURS` |
| Minutes | `MINUTES` |
| Seconds | `SECONDS` |

The countdown must update in real time and use a configurable wedding date and time. If the date has passed, replace the countdown with a graceful message such as **“The celebration has begun.”** Avoid hydration or timezone bugs, and clearly document where the wedding date should be configured.

Use gold-framed countdown cards or temple-pillar-inspired number panels. The numbers should be easy to read on small screens. Include a soft pulse or glow when seconds change, but keep the animation restrained.

## Section 4: Welcome Message

Create a warm personalized section with the heading:

> **Welcome, {guestName}**

Support it with a short message in an elegant invitation style, for example:

> With joyful hearts, we invite you to join us as we begin our forever. Your presence, blessings, and good wishes will make our celebration truly special.

Use a layered parallax background with a traditional kolam pattern, a brass kuthuvilakku, jasmine flowers, or a softly lit mandapam. The content should remain highly readable over the artwork.

## Section 5: Wedding and Reception Details

The final event section must have **two clearly separated parts**, presented as two elegant cards or two columns that stack vertically on mobile.

### Wedding

Display:

- **Event:** Wedding
- **Location:** Pollachi
- **Date:** Add a clearly configurable placeholder for the wedding date.
- **Time:** Add a clearly configurable placeholder for the wedding time.

### Reception

Display:

- **Event:** Reception
- **Location:** Coimbatore
- **Date:** Add a clearly configurable placeholder for the reception date.
- **Time:** Add a clearly configurable placeholder for the reception time.

Use distinct but harmonious visual treatments for the two cards. The Wedding card may use a traditional mandapam, sacred lamp, or floral motif. The Reception card may use a celebration garland, gold border, or evening lamp motif.

Add location buttons such as **“View Wedding Location”** and **“View Reception Location.”** These buttons should be wired to configurable map URLs. If exact venues are not yet provided, use placeholder URLs and clearly mark them for replacement. Do not invent exact venue addresses.

## Optional Closing Area

End with a calm, emotional closing section containing:

> **With love, ArunBalan & Subhashini**
>
> We look forward to celebrating this beautiful beginning with you.

Include a final temple-lamp illustration or closing gopuram silhouette, a small ornamental divider, and a discreet copyright or invitation footer. Add a **“Replay Invitation”** or **“Open Again”** control only if it does not interrupt the primary experience.

## Interaction and Motion Requirements

Use scroll-based parallax carefully. Background layers should move at different speeds, but the effect must remain smooth on mobile and should not cause horizontal overflow. Prefer CSS transforms and `requestAnimationFrame` or an efficient animation library rather than expensive scroll handlers.

Animate sections into view with gentle fades, upward movement, scale transitions, or mask reveals. Use staggered animation for ornamental elements. Avoid animating large blur filters or too many particles on low-powered devices. Pause or simplify decorative animation when the page is not visible.

## Background Music: Mild Tamil Love Song

Add an optional **mild Tamil romantic background song** to create a warm, dreamy emotional atmosphere. The music should be soft, instrumental, acoustic, or gently vocal-led, with a graceful South Indian romantic mood. Prefer a properly licensed, royalty-free Tamil love-song track or an original commissioned composition. Do not use copyrighted film music unless the owner has supplied appropriate permission and the audio file.

The audio experience should begin only after the visitor interacts with the invitation, ideally when they click **“Open Invitation.”** Never force autoplay with sound on page load. If the browser blocks playback, continue the invitation normally without showing an error. Add a discreet floating music control with a traditional lamp, veena, or musical-note icon and an accessible label such as **“Play background music”**, **“Pause background music”**, or **“Mute background music.”**

Use a gentle fade-in when the song starts and a gentle fade-out when it is paused. Set the initial volume to approximately 20–30% so the music remains atmospheric and never competes with the invitation. Loop the track smoothly only if the supplied audio is designed for looping. Respect the user’s mute preference during the session, provide keyboard access, include visible focus states, and honor `prefers-reduced-motion` by disabling decorative audio-control animations while keeping the control functional.

The audio implementation should use a configurable file path such as `/audio/tamil-love-song.mp3`, with a clear placeholder comment showing where the licensed song should be added. If no audio file is available, hide or disable the music control gracefully rather than displaying a broken player.

The page should support a background music control only if an audio asset is supplied. Do not autoplay audio with sound. If music is included, provide a clearly visible mute/unmute control and respect browser autoplay restrictions.

## Technical Requirements

Build the page as a polished single-page experience with reusable components for the envelope, hero, countdown, welcome section, event cards, parallax layers, and decorative ornaments. Keep all editable wedding information in one configuration object, including the couple names, locations, event dates, times, map links, images, and message copy.

Use a component structure similar to:

```text
WeddingInvitation
├── EnvelopeIntro
├── HeroSection
├── PersonalizedCountdown
├── WelcomeSection
├── EventDetails
│   ├── WeddingCard
│   └── ReceptionCard
└── ClosingSection
```

Implement the following state and behavior:

- `guestName`: stores the submitted visitor name.
- `isEnvelopeOpening`: controls the envelope animation state.
- `hasEnteredInvitation`: controls whether the invitation is visible.
- `countdown`: stores the live days, hours, minutes, and seconds.
- Input validation and safe text rendering.
- Countdown cleanup on component unmount.
- A replay or reset mechanism only if it improves the experience.

Use optimized images with responsive sizing, lazy loading for below-the-fold images, and graceful fallbacks if an image fails to load. Ensure good contrast between text and background. Add Open Graph metadata and a meaningful page title such as **“ArunBalan weds Subhashini — Wedding Invitation.”**

## Responsive and Accessibility Requirements

The experience must work well at approximately 320px mobile width, standard phone widths, tablets, laptops, and wide desktop displays. On mobile, stack all sections vertically, reduce parallax intensity, keep the envelope fully visible, and ensure all buttons are comfortably tappable.

Use semantic headings in logical order, labels for the name input, keyboard-accessible buttons, visible focus indicators, sufficient color contrast, alt text for meaningful images, and `aria-live` for countdown updates where appropriate. Decorative images should use empty alt text. Include a reduced-motion mode that disables or minimizes envelope and parallax animation.

## Desired Quality Bar

The final result should feel like a **digital Tamil wedding card**, not a generic landing page. Prioritize emotional pacing, visual elegance, personalization, and cultural detail. The first screen should create anticipation; the envelope opening should feel ceremonial; the hero should feel grand; the countdown should feel personal; and the final Wedding and Reception cards should make the practical details easy to find.

Use placeholder wedding dates and image assets where information is missing, but make every placeholder easy to replace. Do not fabricate unprovided addresses, dates, or personal details. Ensure the complete experience is functional from the first name entry through the final event details section.

## Acceptance Criteria

The implementation is complete when the user can enter a name, open the envelope through a slow animated transition, see the personalized guest name in the countdown and welcome sections, view a live countdown, scroll through a Tamil temple-inspired parallax invitation, and find separate Wedding/Pollachi and Reception/Coimbatore details. The page must be responsive, accessible, visually polished, and free of console errors.

## Reference

The interaction and content-flow inspiration is the supplied reference page: [Kanna & Rakshna — Just Evites](https://justevites.com/pages/kanna-and-rakshna). Use it only as a reference for the envelope entry, personalized greeting, countdown, image-led storytelling, and event-detail progression. Create an original Tamil traditional visual system for ArunBalan and Subhashini.

**Author:** Manus AI

## References

[1]: https://justevites.com/pages/kanna-and-rakshna "Kanna & Rakshna — Just Evites wedding invitation reference"
