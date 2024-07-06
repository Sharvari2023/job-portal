import db from "../config/db.js";
import moment from "moment";

// -------------insert jobs----------------
export const jobcontroller = async (req, res, next) => {
    const { company, position, status, worktype, location, description } = req.body;
    if (!company || !position) {
        next("please provide all fields");
    }
    const createdBy = req.body.user.id;
    console.log(createdBy, 'creadted by id')
    const result = await db.query(
        `INSERT INTO jobs (company, position, created_by,status,work_type,work_location,description)
         VALUES ($1, $2, $3,$4,$5,$6,$7)
         RETURNING *`,
        [company, position, createdBy, status, worktype, location, description]
    );

    // Log the created job's ID
    console.log(result.rows[0].job_id);

    // Send a successful response
    res.status(201).json({ message: "Job created successfully", job: result.rows[0] });
}
//----get jobs and filter and sort jobs----
export const getalljobcontroller = async (req, res, next) => {
    const jobs = await db.query("SELECT * FROM jobs WHERE created_by=$1", [req.user.id])
    /*res.status(200).json({
        totaljobs: jobs.length,
        jobs
    })*/
    const { status, position, search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM jobs WHERE 1=1`; // Base query that always evaluates to true
    const queryParams = [];
    //logic filters
    if (status && status !== "all") {
        query += ` AND status = $${queryParams.length + 1}`;
        queryParams.push(status);
    }
    if (position && position !== "all") {
        query += ` AND position = $${queryParams.length + 1}`;
        queryParams.push(position);
    }
    if (search) {
        query += ` AND position ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${search}%`);
    }
    //adding sorting to the query
    if (sort) {
        switch (sort) {
            case 'latest':
                query += ` ORDER BY created_at DESC`;
                break;
            case 'oldest':
                query += ` ORDER BY created_at ASC`;
                break;
            case 'a-z':
                query += ` ORDER BY position ASC`;
                break;
            case 'z-a':
                query += ` ORDER BY position DESC`;
                break;
            default:
                break;
        }
    }
    // Add pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    const { rows: getjobs } = await db.query(query, queryParams);
    // Count total jobs without pagination
    let countQuery = `SELECT COUNT(*) FROM jobs WHERE 1=1`;
    const countParams = [];

    if (status && status !== "all") {
        countQuery += ` AND status = $${countParams.length + 1}`;
        countParams.push(status);
    }
    if (position && position !== "all") {
        countQuery += ` AND position = $${countParams.length + 1}`;
        countParams.push(position);
    }
    if (search) {
        countQuery += ` AND position ILIKE $${countParams.length + 1}`;
        countParams.push(`%${search}%`);
    }

    const { rows: countResult } = await db.query(countQuery, countParams);
    const totalJobs = parseInt(countResult[0].count, 10);
    const numOfPages = Math.ceil(totalJobs / limit);

    // Return the response
    res.status(200).json({
        totalJobs: getjobs.length,
        totalJobs,
        getjobs,
        numOfPages,
    });
}
//---update jobs----
export const updatejobcontroller = async (req, res, next) => {

    const { company, position, newposition } = req.body
    if (!company || !position || !newposition) {
        next('provide all required parameters')
    }
    const job = await db.query("SELECT * FROM jobs WHERE created_by=$1 AND position=$2 ", [req.user.id, position]);
    if (job.rows.length === 0) {
        next('no job found with this id')
    }
    const jobresult = job.rows[0];
    if (req.user.id != String(jobresult.created_by)) {
        next('you are not authorised to perform this operation')
        return;

    }
    const updatejob = await db.query("UPDATE jobs SET company = $1, position = $2 WHERE job_id = $3 RETURNING *",
        [company, newposition, jobresult.job_id])
    res.status(200).json({ updatejob })

}
//-------------delete job-----------------
export const deletejobcontroller = async (req, res, next) => {

    const { id } = req.params
    const job = await db.query("SELECT * FROM jobs WHERE job_id=$1  ", [id]);
    if (job.rows.length === 0) {
        next('no job found with this id')
    }
    const jobresult = job.rows[0];
    if (req.user.id != String(jobresult.created_by)) {
        next('you are not authorised to perform this operation')
        return;

    }
    const deletejob = await db.query("DELETE FROM jobs WHERE job_id=$1", [jobresult.id])
    res.status(200).json({ message: 'job deleted succesfully' })

}
//-------------statastrics of jobs------------
export const jobstatuscontroller = async (req, res, next) => {
    const userId = req.user.id;

    //fetch job statastics grouped by status
    const statsresult = await db.query("SELECT status,COUNT(*) AS count FROM jobs WHERE created_by=$1 GROUP BY status", [userId])
    // Transform stats into a dictionary using forEach
    const stats = {};
    statsresult.rows.forEach((row) => {
        stats[row.status] = parseInt(row.count, 10);
    });
    //default stats
    const defaultstats = {
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0,
    }

    //fetch monthly application status
    const monthlyApplicationResult = await db.query(`
            SELECT EXTRACT(YEAR FROM created_at) AS year,
                   EXTRACT(MONTH FROM created_at) AS month,
                   COUNT(*) AS count
            FROM jobs
            WHERE created_by = $1
            GROUP BY year, month
            ORDER BY year DESC, month DESC
        `, [userId])

    // Transform the monthly application statistics
    const monthlyApplication = monthlyApplicationResult.rows.map((item) => {
        const { year, month, count } = item;
        const date = moment()
            .month(month - 1)
            .year(year)
            .format("MMM Y");
        return { date, count: parseInt(count, 10) };
    });

    res.status(200).json({
        totalJobs: statsresult.rowCount,
        defaultstats,
        monthlyApplication,
    });
}
