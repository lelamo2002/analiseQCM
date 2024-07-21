require('dotenv').config();

const bodyParser = require('body-parser');
const OpenAI = require('openai');
const puppeteer = require('puppeteer');
const fs = require('fs/promises');

const appToAnalyze = "https://play.google.com/store/apps/details?id=com.wbd.stream&hl=pt_BR";

const buttonSelector = 'button[aria-label="Ver mais informações sobre Classificações e resenhas"]';

const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
};
const openai = new OpenAI(configuration);

const puppeteerOptions = {
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
};

async function getReviews() {
  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();
  await page.goto(appToAnalyze);

  await page.waitForSelector(buttonSelector);
  await page.click(buttonSelector);

  await page.waitForSelector('.RHo1pe .h3YV2d');

  await autoScroll(page);

  const reviews = await page.evaluate(() => {
    const reviews = [];
    const reviewElements = document.querySelectorAll('.RHo1pe .h3YV2d');
    reviewElements.forEach((reviewElement) => {
      reviews.push(reviewElement.innerText);
    });
    return reviews;
  });

  await browser.close();
  return reviews;
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    const distance = 100;
    const delay = 100;
    const scrollableSection = document.querySelector('.RHo1pe').parentElement.parentElement.parentElement;
    let i = 0;

    while (i < 600) {
      scrollableSection.scrollBy(0, distance);
      await new Promise(resolve => setTimeout(resolve, delay));
      i++;
    }
  });
}

getReviews().then(async (reviews) => {
  console.log('Total Reviews:', reviews.length);

  await fs.writeFile('reviews.txt', reviews.join('\n\n'));

  const setupMessage = 'You are part of a data analysis system. You are given the following review of the app "Stream" from the Google Play Store. Please analyze the review and judge if they are related to the usability and provide a response in the following format: { "feedback": "positive/negative/neutral" }. Do not add anything else to the reply or the system will not understand the response. Here is the review:\n\n';

  // Feedback counters
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let processedCount = 0;

  for (let i = 0; i < reviews.length ; i++) {  // Limiting to 10 for testing
    const review = reviews[i];
    const prompt = setupMessage + review;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0,
      });

      if (response && response.choices) {
        const result = response.choices[0].message.content;
        console.log('Response:', result);

        if (/^\{ "feedback": "(positive|negative|neutral)" \}$/.test(result.trim())) {
          await fs.appendFile('responses.txt', result + '\n');
          
          const feedback = JSON.parse(result).feedback;
          processedCount++;
          if (feedback === 'positive') positiveCount++;
          else if (feedback === 'neutral') neutralCount++;
          else if (feedback === 'negative') negativeCount++;
        } else {
          console.error('Unexpected response format:', result);
        }
      } else {
        console.error('Unexpected API response:', response);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const positivePercentage = (positiveCount / processedCount) * 100;
  const neutralPercentage = (neutralCount / processedCount) * 100;
  const negativePercentage = (negativeCount / processedCount) * 100;

  const summary = `
Total Reviews Analyzed: ${processedCount}
Positive Feedback: ${positivePercentage.toFixed(2)}%
Neutral Feedback: ${neutralPercentage.toFixed(2)}%
Negative Feedback: ${negativePercentage.toFixed(2)}%
  `;
  console.log(summary);

  await fs.writeFile('summary.txt', summary);

}).catch((error) => {
  console.error('Error:', error);
});
