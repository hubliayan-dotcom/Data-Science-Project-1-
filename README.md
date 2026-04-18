# InsightPoll Visualizer: Placement-Ready Data Analytics Dashboard

A professional-grade data analytics pipeline and interactive dashboard designed to transform raw survey data into actionable strategic intelligence. This project demonstrates the full Data Analyst workflow: from synthetic data generation and backend cleaning to multi-dimensional visualization and stakeholder-ready presentation.

## 🚀 Live Demo
[Dashboard Preview](https://ais-dev-bsoafsyzwa4r6ovrvyeymq-50948685477.asia-southeast1.run.app)

---

## 📊 Project Overview

### 1. What Is a Poll Results Visualizer?
Raw survey responses are often unstructured and hard to interpret. This tool automates the entire ingestion-to-insight pipeline, providing clear, interactive visualizations including bar charts, trend lines, demographic breakdowns, and qualitative feedback word clouds.

### 2. Real-World Use Cases
- **Customer Feedback Analytics**: Visualize NPS scores and product ratings.
- **Product Market Research**: Measure feature preference rankings across demographics.
- **Employee Engagement**: Satisfaction trends by department and tenure.
- **Election Monitoring**: Regional vote share tracking and participation trends.

---

## 🛠️ Tech Stack & Setup

| Category | Technology |
| :--- | :--- |
| **Frontend** | React 19, Recharts, Framer Motion, Tailwind CSS (V4) |
| **Backend** | Node.js, Express, TSX (Server-side Analytics Engine) |
| **Icons & Style** | Lucide React, Inter Font Family |
| **Utilities** | Date-fns, CLSX, Tailwind-Merge |

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Poll-Results-Visualizer.git
   cd Poll-Results-Visualizer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

---

## 📐 Data Flow Architecture

The project follows a rigorous 5-stage pipeline:
1. **Data Generation**: Backend script generates 400+ rows of realistic synthetic poll data with weighted distributions.
2. **Preprocessing**: Server-side "Cleaning Pipeline" handles deduplication, null-handling (fill/drop), and type standardization.
3. **Exploratory Analysis**: Aggregation logic calculates vote shares, satisfaction averages, and cross-tabulations.
4. **Interactive Dashboard**: Client-side filtering allows users to segment insights by **Region** and **Age Demographic**.
5. **Narrative Visualization**: 6 distinct chart types and KPI cards present the data story.

---

## 📈 Dashboard Features

- **KPI Metrics**: Instant scannable stats for Total Responses, Average Satisfaction, Top Tool, and Active Regions.
- **Vote Distribution**: High-fidelity Bar Chart showing tool preference volume.
- **Market Share**: Donut-style Pie Chart for percentage-based competitive analysis.
- **Submission Trends**: Area chart visualizing organic respondent growth over time.
- **Satisfaction Distribution**: Histogram mapping user sentiment from 1 (Poor) to 5 (Excellent).
- **Sentiment Map**: Semantic "Word Cloud" extracting qualitative themes from open-text feedback.
- **Regional Segmentation**: Horizontal stacked charts for geo-specific tool preference.

---

## 🎓 Interview Preparation (Data Analyst Focus)

**Q: Why use weighted probabilities for synthetic data?**  
*A: To mirror real-world usage patterns (e.g., Python leading at 35%). This ensures the dashboard demonstrates "meaningful distribution" rather than just uniform random noise.*

**Q: How did you handle unstructured text feedback?**  
*A: I implemented a basic NLP preprocessing layer that tokenizes the feedback, removes stop-words (less than 3 chars), and calculates term frequency to generate the sentiment word cloud.*

**Q: How would you scale this for 1,000,000 records?**  
*A: I would move the cleaning and aggregation logic from the app layer to the database layer (OLAP), using partitioned SQL or Google BigQuery to serve pre-aggregated views to the dashboard.*

---

## 📜 License
SPDX-License-Identifier: Apache-2.0

## 👤 Author
**Hubliayan**
[GitHub Profile](https://github.com/hubliayan)
