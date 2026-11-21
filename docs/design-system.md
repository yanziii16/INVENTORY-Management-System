# Inventory Management Module Design System

## 1. Purpose

This document describes the visual design system and interface conventions used by the IDSC Inventory Management System prototype. It documents the shared Figma design reference, navigation, color palette, typography hierarchy, reusable interface components, status indicators, and identified Inventory module screens.

## 2. Shared Design Reference

* *Design system board:* [Inventory Management UI Design — Figma](http://figma.com/design/LoF7PEroywmm10qkMqBzqZ/Inventory-Management-UI-Design?node-id=460-1957&t=cTvMafRhVYKyqcml-0)
* *Prototype reference:* [Inventory Management System Prototype](http://figma.com/design/LoF7PEroywmm10qkMqBzqZ/Inventory-Management-UI-Design?node-id=460-1957&t=cTvMafRhVYKyqcml-0)

The Figma design is the visual reference for the Inventory Management module. The interface follows a modern administrative dashboard style, with dark emerald/forest green as the primary brand color, a pale mint content canvas, clean white data cards, rounded controls, and line-style vector icons.

## 3. Overall Layout and Navigation

The dashboard uses a vertical, dark-green sidebar with rounded container corners. The IDSC logo and Inventory Management System label appear at the top. Navigation labels are white, and the active item is distinguished by a lighter-green highlight container.

The sidebar contains the following navigation items:

1. Dashboard


2. Product / items


3. Categories


4. User


5. Reports


6. Settings



The main content area uses a clean card-based layout with generous spacing. The top navigation bar includes a global search field ("Search Something..."), a notification bell with a green indicator dot, and an admin user avatar with a dropdown arrow ("Admin User").

## 4. Color Palette

The design groups colors into primary, secondary, neutral, and status colors.

| Color group | Visual characteristics | Intended use |
| --- | --- | --- |
| *Primary* | Dark emerald/forest green through pale mint | Main brand elements, primary actions (+ Add New Item, Login), active navigation, and selected controls

 |
| *Secondary* | Softer mint and light green shades | Card backgrounds, table header rows, badge containers, and subtle element highlights

 |
| *Neutral* | Dark slate gray, light gray, soft whites, and near-white canvas | Primary body text, inputs, container card fills, grid dividers, and borders

 |
| *Success* | Green / Mint | Positive statuses (In Stock, Active, Restocked, Returned)

 |
| *Warning* | Amber, yellow, or soft orange | Warning states (Low Stock, For Repair, Under Maintenance)

 |
| *Error* | Red or light red | Destructive actions, system delete icons, soft inactive alerts, and Damaged stock status

 |
| *Information* | Blue | Informational tags (Issued stock activity)

 |

The exact hexadecimal values of the color swatches are derived from the visible color families in the interface design.

## 5. Typography

The layout presents a clean sans-serif typography system with a clear visual hierarchy:

* *Heading 1:* Largest title for primary page view headers (e.g., "Dashboard", "Products/ Items", "User Management").


* *Heading 2:* Secondary section titles (e.g., "Recent Stock Activity", "Welcome, Admin!").


* *Heading 3:* Subsection labels, KPI metric numbers, and item table titles.


* *Body text:* Regular text used for descriptions, table contents, and form field labels.


* *Caption text:* Smaller supporting text used for metadata, timestamps, SKU values, and field subheaders.



The interface retains a consistent sans-serif appearance with strong contrast between headings, body text, and captions.

## 6. Buttons and Actions

Buttons use rounded corners (border-radius) and consistent visual styling across all modules.

| Component | Appearance and purpose |
| --- | --- |
| *Primary button* | Solid green filled background with white text for main actions (e.g., Login, Sign Up, + Add New Item, + Add New Category, + Add New User)

 |
| *Secondary button* | Light mint or outlined container with dark text for alternative filter or cancel interactions |
| *Filter controls* | Light gray/mint dropdown buttons for filtering records by Category, Status, or Sorting order

 |
| *Destructive action button* | Red-tinted background container with trash icon for deleting items or removing accounts

 |
| *Icon button* | Compact rounded action buttons containing inline icons: *Edit* (Pencil), *View* (Eye), and *Delete* (Red Trash)

 |

Buttons feature explicit descriptive labels or recognizable action icons so users can distinguish standard updates from destructive operations.

## 7. Inputs, Search, and Toggle Controls

### Text Inputs

Text inputs feature rounded borders, inset outline icons (e.g., envelope, lock, user silhouette), and contextual placeholder text (e.g., "Enter email or username", "Search items name category, or SKU...").

### Search Field

The top navigation includes a prominent rounded search input with a magnifying-glass icon. In-page filtering inputs reuse this exact visual language across all sub-modules.

### Toggle & Checkbox Controls

Checkboxes feature green fill states when checked, paired with label text for options like "Remember me" or "I agree to the Terms & Privacy Policy".

### Notification and User Controls

The top navigation includes a notification bell icon with an active indicator badge, alongside a circular profile avatar labeled "Admin User" with an expandable dropdown trigger.

## 8. Icons and Reusable Components

The design system employs small, consistent line icons for standard interface features, including home/dashboard, box/inventory, categories grid, users, bar chart reports, settings, search, eye/view, edit pencil, and delete trash icons.

Reusable interface components include:

* Vertical sidebar navigation bar


* Header navigation bar with search and profile controls


* Summary KPI metric cards


* Primary action buttons (+ Add New ...)


* Inline table action clusters (Edit, View, Delete)


* Multi-column data tables with alternating row styles


* Form text fields with icon prefix/suffix elements


* Rounded status pill badges



All components adhere to unified spacing, corner radii, line-art icon styling, and color conventions throughout the dashboard layout.

## 9. Status Badges

Status badges are compact, pill-shaped labels used across tables and dashboard logs.

| Visual variant | General visual meaning | Inventory status example |
| --- | --- | --- |
| *Green / Mint* | Positive or normal operational state | In Stock, Active, Restocked, Returned

 |
| *Amber / Orange* | Warning or attention-required state | Low Stock, For Repair, Under Maintenance

 |
| *Red / Soft Red* | Error, inactive, or damaged state | Inactive, Damaged

 |
| *Blue* | Transactional or status log update | Issued

 |

Status badges retain concise text labels alongside color coding to ensure immediate readability.

## 10. Identified Prototype Screens

The following core screens have been identified from the design system prototype review.

| Screen or area | Purpose |
| --- | --- |
| *Login page* | Secure portal allowing administrative and authorized users to log into the system.

 |
| *Registration page* | Form for creating new administrative or user credentials.

 |
| *Main dashboard* | Central administrative landing screen featuring KPI summary cards and a live Recent Stock Activity history table.

 |
| *Products / Items management* | Comprehensive stock directory detailing Item Name, Category, SKU, Quantity, Status, and record-level management actions.

 |
| *Category management* | Structure for managing product classifications, category descriptions, tagged item counts, and active status states.

 |
| *User management* | Control screen for managing system accounts, email addresses, assigned roles (Admin, Staff, Viewer), and activation states.

 |
| *Reports (Planned module)* | Sub-module container designated for generating and exporting analytical inventory reports.

 |
| *Settings (Planned module)* | System configuration and preference screen.

 |

Sidebar labels represent main operational destinations. Specific sub-actions (such as adding an item or viewing item details) open dedicated modal forms or detail views within these primary sections.

## 11. Interface Consistency and Accessibility

The design system adheres to the following principles:

* Apply green consistently for brand identification, main calls-to-action, and active navigation states.


* Maintain clean layout margins, light card backgrounds, and dark high-contrast text to optimize data readability.


* Use red accent treatments exclusively for destructive actions (e.g., item deletion) and negative/damaged stock statuses.


* Maintain uniform component shapes, rounded corner radii, search bar proportions, and icon stroke styles.


* Establish an intuitive typography hierarchy distinguishing page titles, section headers, field labels, and table values.


* Include explicit text labels alongside icons for all primary controls and status indicators.



## 12. Design Reference and Maintenance

The shared Figma design link in Section 2 serves as the single source of truth for the visual architecture. When visual updates or new screens are added to the Figma project, this documentation should be updated to maintain sync across design, frontend components, and bac