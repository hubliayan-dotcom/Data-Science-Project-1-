# InsightPoll Visualizer

An end-to-end survey analytics dashboard that ingests poll responses, cleans raw survey data, performs aggregation analysis, and generates interactive visual insights for decision-making.

The project demonstrates core data analyst workflows including data preprocessing, KPI generation, segmentation analysis, and dashboard reporting using modern web technologies.

## Live Demo
🔗 [View Live Dashboard](https://ais-dev-bsoafsyzwa4r6ovrvyeymq-50948685477.asia-southeast1.run.app)

## Business Value
Survey analytics dashboards help organizations transform raw feedback into actionable insights. This project simulates how analytics teams process poll responses, monitor satisfaction metrics, identify regional trends, and support business decisions through interactive dashboards. It is directly aligned with roles such as **Data Analyst**, **BI Analyst**, and **Product Analytics**.

## Sample Insights Generated
- **Python emerged as the most preferred tool** with a 35% vote share.
- **The North region showed the highest average satisfaction score**, indicating localized success.
- **Respondents aged 25–34 represented the largest engagement group**, highlighting the target demographic.
- **Survey responses peaked during active submission windows**, revealing organic data collection patterns.

## Screenshots

### Dashboard Overview
![Dashboard Overview](https://picsum.photos/seed/dashboard/800/450)

### Vote Distribution Analysis
![Vote Distribution](https://picsum.photos/seed/chart/800/400)

### Submission Trend and Word Cloud
![Trends](https://picsum.photos/seed/trend/800/400)

### Data Cleaning Pipeline
![Cleaning Pipeline](https://picsum.photos/seed/pipeline/800/300)

### Architecture Overview
![Architecture](https://picsum.photos/seed/architecture/800/200)

## Architecture Workflow
Raw Survey Data (CSV / Forms)  
↓  
Data Cleaning Pipeline  
↓  
Aggregation & KPI Calculation  
↓  
Interactive Dashboard  
↓  
Insights & Reporting

## Key Features
- **Automated survey data preprocessing**: Trimming, casing, and null handling.
- **KPI metrics dashboard**: Total responses, satisfaction scores, and top trends.
- **Region-wise and demographic filtering**: Multi-dimensional segmentation.
- **Vote distribution visualizations**: Professional bar and donut charts.
- **Satisfaction trend analysis**: Statistical distribution of user sentiment.
- **Feedback word cloud generation**: Qualitative theme extraction.
- **Raw vs cleaned data comparison**: Real-time integrity verification.

## Tech Stack
- **Frontend**: React, Recharts, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript
- **Analytics**: Aggregation Pipelines, KPI Metrics, Segmentation Analysis
- **Utilities**: Date-fns, Lucide React

## Interview Highlights

**Q: Why synthetic data?**  
To simulate realistic survey distributions and demonstrate meaningful dashboard insights that mirror real-world market trends.

**Q: How would this scale?**  
By moving aggregation logic to a database layer such as PostgreSQL or BigQuery for faster analytics and using materialized views for high-volume datasets.

## Future Improvements
- **Live survey ingestion via API**: Connecting directly to Google Sheets or Typeform.
- **Real-time dashboard refresh**: Using WebSockets for instant updates.
- **Advanced sentiment analysis**: Integrating NLP libraries (TextBlob/VADER) for deeper feedback scoring.
- **Database integration**: Replacing static CSV with a scalable relational database.
- **External Export**: One-click PDF report generation or Power BI/Tableau data connector.

---

## 🛠️ Installation & Setup

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

## 📜 License
SPDX-License-Identifier: Apache-2.0

## 👤 Author
**Hubliayan**
[GitHub Profile](https://github.com/hubliayan)
