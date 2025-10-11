# Glances System Monitoring

A cross-platform monitoring tool that tracks your Docker host's CPU, memory, disk, and network usage—and publishes it all to MQTT for real-time monitoring.

**Perfect for system administrators** who need visibility into host performance and container resource usage.

## Configuration

The `glances.conf` file is pre-configured to:
- Monitor your Docker host system resources
- Publish metrics to HiveMQ Edge broker at `mes-hivemq-edge:1883`
- Use topic structure: `glances/<metric>` (one topic per metric type)
- No authentication required (you can add it if needed)

## MQTT Topics Published

Glances publishes these metrics to MQTT every few seconds:

| Topic | What It Measures |
|-------|------------------|
| `glances/cpu` | CPU usage percentage and load |
| `glances/mem` | Memory usage (used, free, cached) |
| `glances/load` | System load averages (1, 5, 15 min) |
| `glances/network` | Network traffic (bytes sent/received) |
| `glances/disk` | Disk I/O operations and throughput |
| `glances/docker` | Docker container resource usage |

**Plus many more** - temperatures, processes, file systems, etc.

**Use case:** Subscribe to these topics in your SCADA, historian, or Node-RED to monitor host health alongside your production data.

## Web Interface

Access the Glances web UI to see live system stats:

**http://localhost:61208**

(Port configurable via `GLANCES_PORT` in `.env`)

**What you'll see:** Real-time dashboard with CPU, memory, network, disk, and container statistics.

## Authentication

Currently, Glances publishes to MQTT **without authentication** (suitable for internal networks).

**To add MQTT authentication:**

1. Edit `glances.conf`:
   ```ini
   [mqtt]
   host=mes-hivemq-edge
   port=1883
   user=your_username
   password=your_password
   ```

2. Restart Glances:
   ```bash
   docker-compose restart glances
   ```

**Why add authentication?** If your MQTT broker is exposed outside your internal network, authentication prevents unauthorized access to system metrics.

## Topic Structure Options

You can change how Glances organizes MQTT topics:

- **`per-metric` (current):** One topic per metric type (e.g., `glances/cpu`, `glances/mem`)
  - **Best for:** Subscribing to specific metrics only

- **`per-plugin`:** One topic per plugin with all metrics as JSON
  - **Best for:** Processing full plugin data at once

**To change:** Edit the `topic_structure` setting in `glances.conf` and restart the container.
