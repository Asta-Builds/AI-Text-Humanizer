$pagesJson = @"
[{"title":"Login","prompt":"Design the Login page in the SAME style as the confirmed SaaS design. Use the same brand nav bar (HumanFlow Architect logo, Accueil, Outil Humaniseur, Guide), same workspace grid background pattern, same gradient hero style, same global footer. The login form should be a clean centered card with: email input with mail icon, password input with lock icon, submit button (indigo-600 primary, rounded-2xl), Google OAuth button, and link to create an account. Match the same fonts (Inter, Space Grotesk, JetBrains Mono), colors (indigo-600 primary, slate grays), border-radius (xl/2xl/3xl), shadow system. Use ONLY the fonts, colors, spacing, and component styles defined in the design system."}]
"@

superdesign execute-flow-pages --draft-id "d341a41c-cf5c-4920-af6e-f4cb6cb56208" --pages $pagesJson --context-file .superdesign\design-system.md --context-file src\index.css
