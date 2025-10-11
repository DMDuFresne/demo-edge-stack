# Homepage Dashboard Configuration

This directory contains the configuration files for the Homepage dashboard, which serves as the central access point for all Abelara MES services.

## Overview

Homepage is a modern, fully static, fast, secure, and customizable application dashboard. It provides a centralized interface to access all MES services, monitor system resources, and track container health.

**Official Documentation:** https://gethomepage.dev/

## Quick Start

1. Homepage is configured via YAML files in this directory
2. All changes are automatically detected and applied (no restart required)
3. Access the dashboard at http://localhost:3000 (or configured `HOMEPAGE_PORT`)

## Configuration Files

### `settings.yaml`
Main dashboard settings including:
- **Title & Branding:** Dashboard title and favicon
- **Theme:** Dark theme with slate color scheme (closest to Abelara brand)
- **Layout:** Service group organization and column structure
- **Display Options:** Header style, version visibility, status indicators

### `services.yaml`
Service definitions organized into logical groups:

#### Services
- **Ignition Gateway** (port 8088) - SCADA/MES Platform

#### Historian
- **Historian** (port 4511) - Time Series Data Storage
- **Historian Explorer** (port 4531) - Time Series Data Explorer
- **Historian Collector** (port 4521) - Data Collection Service

#### Infrastructure
- **HiveMQ Edge** (port 8080) - MQTT Broker
- **pgAdmin** (port 5050) - Database Administration
- **TimescaleDB** - Time Series Database (no GUI)

#### Monitoring
- **Glances** (port 61208) - System Monitoring
- **Uptime Kuma** (port 3001) - Uptime Monitoring
- **Watchtower** - Container Update Management

Each service includes:
- Icon for visual identification (Material Design or Simple Icons)
- Direct link to web interface
- Description
- Docker container integration for real-time status monitoring

### `widgets.yaml`
Dashboard widgets displayed on the home screen:
- **Resources Widget:** CPU, memory, disk usage, temperature, uptime
- **DateTime Widget:** Current date and time display
- **Search Widget:** Quick web search functionality

### `bookmarks.yaml`
Quick access links organized by category:
- **Documentation:** Official documentation for all MES services (Ignition, Timebase, HiveMQ, TimescaleDB, pgAdmin)
- **Resources:** Homepage and Docker documentation

### `docker.yaml`
Docker integration configuration:
- Socket path for container monitoring (`/var/run/docker.sock`)
- Enables real-time container status and statistics

### `custom.css`
Custom CSS theme applying Abelara brand colors:
- **Background:** Abelara brand black (#252525)
- **Brand Colors:** Light blue, light green, pale yellow accents
- **Based on:** Abelara Brand Book (June 2025)

## Docker Integration

Homepage has access to the Docker socket (`/var/run/docker.sock`) which enables:
- Real-time container status (running, stopped, health)
- Container statistics (CPU, memory, network)
- Automatic service discovery
- Live status indicators on service cards

**Cross-Platform Compatibility:** Works on Windows, Linux, and macOS with Docker Desktop or Docker Engine.

## Customization

### Adding a New Service

Edit `services.yaml` and add your service under the appropriate group:

```yaml
- Group Name:
    - Service Name:
        icon: mdi-icon-name  # Material Design Icons (mdi-) or Simple Icons (si-)
        href: http://localhost:port
        description: Service description
        container: container-name
```

**Icon Resources:**
- Material Design Icons: https://pictogrammers.com/library/mdi/
- Simple Icons: https://simpleicons.org/

### Changing Theme

Edit `settings.yaml`:

```yaml
theme: dark  # Options: dark, light
color: slate # Options: slate, gray, zinc, neutral, stone, etc.
```

**Note:** The Abelara brand black background (#252525) is applied via `custom.css`.

### Adding Widgets

Edit `widgets.yaml` to add new widgets. Available widgets include:
- resources
- datetime
- search
- greeting
- openmeteo (weather)
- And many more - see [Homepage Widgets Documentation](https://gethomepage.dev/widgets/)

### Customizing Layout

Edit `settings.yaml` to modify the layout structure:

```yaml
layout:
  Section Name:
    style: row      # Options: row, column
    columns: 3      # Number of columns (for row style)
```

Current layout:
- **Services:** 1 column (Ignition only)
- **Historian:** 3 columns (all Timebase services)
- **Infrastructure:** 3 columns (MQTT, pgAdmin, TimescaleDB)
- **Monitoring:** 3 columns (Glances, Uptime Kuma, Watchtower)

## Environment Variables

The following environment variables can be set in the `.env` file:

| Variable | Default | Description |
|----------|---------|-------------|
| `HOMEPAGE_PORT` | 3000 | Port to access Homepage dashboard |
| `HOMEPAGE_TAG` | latest | Docker image tag |

## File Permissions

Homepage runs with PUID=1000 and PGID=1000. Ensure configuration files are readable by this user/group.

## Troubleshooting

### Dashboard Not Loading
- Check container status: `docker ps | grep homepage`
- View logs: `docker logs mes-homepage`
- Verify port 3000 is not in use
- Ensure config files are valid YAML (use online YAML validator)

### Services Not Showing Container Status
- Verify Docker socket is mounted: Check docker-compose.yml has `/var/run/docker.sock:/var/run/docker.sock`
- Check container names match exactly in `services.yaml`
- Ensure containers are on the same network (`abelara-mes-network`)
- View debug logs: `docker logs mes-homepage | grep -i docker`

### Configuration Changes Not Applying
- Homepage auto-reloads on file changes (usually within seconds)
- If changes don't appear, restart container: `docker restart mes-homepage`
- Verify YAML syntax is correct (invalid YAML will be ignored)
- Check file permissions (files must be readable)

### Icons Not Displaying
- Homepage uses two icon sets:
  - **Material Design Icons:** prefix with `mdi-` (e.g., `mdi-factory`)
  - **Simple Icons:** prefix with `si-` (e.g., `si-mqtt`)
- Icon resources:
  - MDI: https://pictogrammers.com/library/mdi/
  - Simple Icons: https://simpleicons.org/
- If icon doesn't exist, Homepage will show the service name initial

### Docker Socket Permission Errors
- **Windows:** Ensure Docker Desktop is running and socket sharing is enabled
- **Linux:** Container runs as root, no additional permissions needed
- **macOS:** Docker Desktop handles socket permissions automatically

## Resource Usage

Homepage is lightweight with configured limits:
- **CPU:** 0.5 cores (max), 0.25 cores (reservation)
- **Memory:** 256MB (max), 128MB (reservation)

## Security Considerations

1. **Read-Only Docker Socket:** Container monitoring only, no control actions
2. **Network Isolation:** Runs on isolated `abelara-mes-network`
3. **No External Exposure:** Only accessible via localhost (configure reverse proxy for external access)
4. **Configuration as Code:** All settings in version-controlled YAML files

## Custom Branding

Homepage supports full branding customization including colors, logos, and styling.

### Custom Logo/Favicon
Edit `settings.yaml`:

```yaml
title: Your Company Name
favicon: /images/logo.png  # Or use URL
logo: /images/logo.svg     # Optional header logo
```

Place logo files in `./images/` directory and mount in docker-compose.yml:
```yaml
volumes:
  - ./config/homepage/images:/app/public/images
```

### Custom Colors
Edit `settings.yaml` to customize the color scheme:

```yaml
color: slate  # Built-in colors: slate, gray, zinc, neutral, stone, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose, red
```

### Advanced Styling with Custom CSS
Create `custom.css` for complete control over appearance:

```css
/* Example: Custom brand colors */
:root {
  --primary-color: #your-color;
  --background-color: #your-bg-color;
}

/* Custom header styling */
header {
  background: linear-gradient(to right, #color1, #color2);
}

/* Service card styling */
.service-card {
  border-left: 4px solid var(--primary-color);
}
```

Mount custom CSS in docker-compose.yml:
```yaml
volumes:
  - ./config/homepage/custom.css:/app/config/custom.css
```

### Custom JavaScript
Create `custom.js` for custom functionality:

```javascript
// Add custom behavior or integrations
console.log('Custom Homepage Loaded');
```

Mount in docker-compose.yml:
```yaml
volumes:
  - ./config/homepage/custom.js:/app/config/custom.js
```

## Advanced Features

### API Integration
Homepage supports many service integrations. Add API widgets to monitor:
- Docker containers
- System resources
- External services
- Custom endpoints

See [Homepage Integrations](https://gethomepage.dev/configs/service-widgets/) for available integrations.

## Backup

Configuration files are located in this directory and should be backed up regularly:
- All `*.yaml` files contain critical dashboard configuration
- Files are plain text and version control friendly
- No database or state files required

## Abelara Branding

Homepage is customized with Abelara brand colors from the official Brand Book (June 2025):

### Brand Colors
- **Black:** #252525 (Background)
- **White:** #FFFFFF
- **Light Blue:** #B3E6E1 (PMS 324C)
- **Light Green:** #D4FDB1 (PMS 358C)
- **Pale Yellow:** #FFFFA9 (PMS 7499C)
- **Red:** #F5602B (PMS 171C - Accent)

### Custom Styling
The `custom.css` file applies minimal custom styling:
- Abelara brand black background
- CSS custom properties for brand colors
- Subtle accent colors on links and headers

All customization is maintained in `custom.css` to keep it separate from official Homepage configuration.

## Support

- **Official Docs:** https://gethomepage.dev/
- **GitHub Issues:** https://github.com/gethomepage/homepage/issues
- **Discord Community:** https://discord.gg/k4ruYNrudu

## Version

Current configuration created for Homepage v0.9+ (latest tag)
