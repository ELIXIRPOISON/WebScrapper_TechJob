const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

const url = "https://www.timesjobs.com/candidate/job-search.html?searchType=Home_Search&from=submit&asKey=OFF&txtKeywords=&cboPresFuncArea=35";

async function scrapeJobs() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const jobs = [];

        $('.job-bx').each((_, element) => {
            const jobTitle = $(element).find('h2 a').text().trim();
            const companyName = $(element).find('.comp-name').text().trim();
            const location = $(element).find('.loc').text().trim();
            const jobType = $(element).find('.job-type').text().trim(); // Adjust selector if necessary
            const postedDate = $(element).find('.sim-posted').text().trim();
            const jobDescription = $(element).find('.list-job-dtl li').text().trim();

            jobs.push({ Job_Title: jobTitle, Company_Name: companyName, Location: location, Job_Type: jobType, Posted_Date: postedDate, Job_Description: jobDescription });
        });

        console.log(jobs);

        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(jobs);
        xlsx.utils.book_append_sheet(workbook, worksheet, "Jobs");
        xlsx.writeFile(workbook, "TechJobs.xlsx");
        console.log("Excel file saved: TechJobs.xlsx");

    } catch (error) {
        console.error("Error scraping jobs:", error.message);
    }
}

scrapeJobs();
