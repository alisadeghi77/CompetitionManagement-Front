# Icon Component Usage Examples

## Basic Usage

```html
<!-- Basic Icon -->
<app-icon name="person"></app-icon>

<!-- Icon with Size -->
<app-icon name="calendar" [size]="24"></app-icon>

<!-- Icon with Color -->
<app-icon name="star-fill" color="#FFD700"></app-icon>

<!-- Icon with Extra Classes -->
<app-icon name="check-circle" extraClass="me-2"></app-icon>

<!-- Icon with All Options -->
<app-icon 
  name="exclamation-triangle-fill" 
  [size]="32" 
  color="#FF0000" 
  extraClass="rotate-animation">
</app-icon>
```

## Common Icons

Here are some commonly used Bootstrap Icons:

| Icon Name | Description | Preview |
|-----------|-------------|---------|
| person | User profile | <i class="bi bi-person"></i> |
| gear | Settings | <i class="bi bi-gear"></i> |
| search | Search | <i class="bi bi-search"></i> |
| house | Home | <i class="bi bi-house"></i> |
| plus | Add | <i class="bi bi-plus"></i> |
| trash | Delete | <i class="bi bi-trash"></i> |
| pencil | Edit | <i class="bi bi-pencil"></i> |
| calendar | Date | <i class="bi bi-calendar"></i> |
| check | Confirm | <i class="bi bi-check"></i> |
| x | Cancel | <i class="bi bi-x"></i> |
| arrow-right | Next | <i class="bi bi-arrow-right"></i> |
| arrow-left | Previous | <i class="bi bi-arrow-left"></i> |
| bell | Notification | <i class="bi bi-bell"></i> |
| envelope | Message | <i class="bi bi-envelope"></i> |
| download | Download | <i class="bi bi-download"></i> |
| upload | Upload | <i class="bi bi-upload"></i> |
| lock | Secure | <i class="bi bi-lock"></i> |
| unlock | Unsecure | <i class="bi bi-unlock"></i> |

## Persian UI Icons

For Persian interfaces, directional icons should be flipped:

| Icon Name | Description | Use Case |
|-----------|-------------|----------|
| arrow-right | Previous (RTL) | Navigation |
| arrow-left | Next (RTL) | Navigation |
| chevron-right | Previous (RTL) | Collapse |
| chevron-left | Next (RTL) | Collapse |

## Status Icons

| Icon Name | Description | Use Case |
|-----------|-------------|----------|
| check-circle-fill | Success | Form submission |
| exclamation-circle-fill | Warning | Alert |
| x-circle-fill | Error | Form error |
| info-circle-fill | Information | Informational message |
| hourglass-split | Loading | Processing |

## Full List of Icons

For a complete list of available icons, visit the [Bootstrap Icons website](https://icons.getbootstrap.com/).
