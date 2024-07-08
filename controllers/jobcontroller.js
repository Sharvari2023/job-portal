import db from "../config/db.js";
import moment from "moment";
//get all jobs irrespective of created by
export const alljobcontroller = async (req, res, next) => {
    const { status, search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    console.log("req.body.user.id is", req.body.user.id)
    let query = `SELECT * FROM jobs WHERE 1=1`; // Ensure jobs are fetched based on user id
    const queryParams = [];

    // Apply filters
    if (status && status !== "all") {
        query += `AND status = $${queryParams.length + 1}`;
        queryParams.push(status);
    }

    if (search) {
        query += ` AND position ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${search}%`);
    }

    // Apply sorting
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

    // Apply pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    try {
        const { rows: jobs } = await db.query(query, queryParams);

        // Count total jobs for pagination
        let countQuery = `SELECT COUNT(*) FROM jobs WHERE created_by=$1`;
        const countParams = [req.body.user.id];

        if (status && status !== "all") {
            countQuery += ` AND status = $${countParams.length + 1}`;
            countParams.push(status);
        }

        if (search) {
            countQuery += ` AND position ILIKE $${countParams.length + 1}`;
            countParams.push(`%${search}%`);
        }

        const { rows: countResult } = await db.query(countQuery, countParams);
        const totalJobs = parseInt(countResult[0].count, 10);
        const numOfPages = Math.ceil(totalJobs / limit);

        res.status(200).json({
            totalJobs,
            jobs,
            numOfPages,
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

};

//handle applied jobs
// Apply to a job
export const applyJobController = async (req, res, next) => {
    const { jobId } = req.params;
    console.log(req.body.user.id)
    const userId = req.body.user.id;

    try {
        // Assuming you have an applications table with columns user_id and job_id
        await db.query(`INSERT INTO applications (user_id, job_id) VALUES ($1, $2)`, [userId, jobId]);

        res.status(200).json({ message: 'Job application successful' });
    } catch (error) {
        console.error('Error applying to job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


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
    const { status, search, sort, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    let query = `SELECT * FROM jobs WHERE created_by=$1`; // Ensure jobs are fetched based on user id
    const queryParams = [req.body.user.id];

    // Apply filters
    if (status && status !== "all") {
        query += ` AND status = $${queryParams.length + 1}`;
        queryParams.push(status);
    }

    if (search) {
        query += ` AND position ILIKE $${queryParams.length + 1}`;
        queryParams.push(`%${search}%`);
    }

    // Apply sorting
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

    // Apply pagination
    query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);

    try {
        const { rows: jobs } = await db.query(query, queryParams);

        // Count total jobs for pagination
        let countQuery = `SELECT COUNT(*) FROM jobs WHERE created_by=$1`;
        const countParams = [req.body.user.id];

        if (status && status !== "all") {
            countQuery += ` AND status = $${countParams.length + 1}`;
            countParams.push(status);
        }

        if (search) {
            countQuery += ` AND position ILIKE $${countParams.length + 1}`;
            countParams.push(`%${search}%`);
        }

        const { rows: countResult } = await db.query(countQuery, countParams);
        const totalJobs = parseInt(countResult[0].count, 10);
        const numOfPages = Math.ceil(totalJobs / limit);

        res.status(200).json({
            totalJobs,
            jobs,
            numOfPages,
        });
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//---update jobs----

export const updatejobcontroller = async (req, res, next) => {
    const { company, position, newPosition, status, worktype, location, description } = req.body;

    // Check if required parameters are provided
    if (!company || !position || !newPosition) {
        return res.status(400).json({ error: 'Provide all required parameters' });
    }

    try {
        // Query to get the job by position and created_by
        const jobQuery = await db.query("SELECT * FROM jobs WHERE created_by=$1", [req.body.user.id]);

        console.log(req.body.user.id);
        console.log(position);
        console.log('Job Query Result:', jobQuery.rows);

        // Check if the job exists
        if (jobQuery.rows.length === 0) {
            return res.status(404).json({ error: 'No job found with this id' });
        }

        const jobresult = jobQuery.rows[0];
        console.log("created by", jobresult.created_by);

        // Check if the user is authorized to update the job
        if (String(req.body.user.id) !== String(jobresult.created_by)) {
            return res.status(403).json({ error: 'You are not authorized to perform this operation' });
        }

        // Update the job
        const updateJobQuery = await db.query(
            "UPDATE jobs SET company = $1, position = $2, status = $4, work_type = $5, work_location = $6, description = $7 WHERE job_id = $3 RETURNING *",
            [company, newPosition, jobresult.job_id, status, worktype, location, description]
        );

        res.status(200).json({
            success: true,
            message: 'Job updated successfully',

        });

    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//-------------delete job-----------------
export const deletejobcontroller = async (req, res, next) => {

    const { id } = req.params
    const job = await db.query("SELECT * FROM jobs WHERE job_id=$1  ", [id]);
    if (job.rows.length === 0) {
        next('no job found with this id')
    }
    const jobresult = job.rows[0];
    if (String(req.body.user.id) != String(jobresult.created_by)) {
        next('you are not authorised to perform this operation')
        return;

    }
    const deletejob = await db.query("DELETE FROM jobs WHERE job_id=$1", [jobresult.id])
    res.status(200).json({ message: 'job deleted succesfully' })

}
//-------------statastrics of jobs------------
/*export const jobstatuscontroller = async (req, res, next) => {
    const userId = req.body.user.id;
    let { status } = req.query;

    // If status is not provided or is 'all', set it to a wildcard
    status = status && status !== 'all' ? status : '%';

    // Fetch job statistics grouped by status
    const statsQuery = `
        SELECT status, COUNT(*) AS count 
        FROM jobs 
        WHERE created_by = $1 
        AND status LIKE $2 
        GROUP BY status
    `;
    const statsParams = [userId, status];

    try {
        const statsResult = await db.query(statsQuery, statsParams);

        // Transform stats into a dictionary using reduce
        const stats = statsResult.rows.reduce((acc, row) => {
            acc[row.status] = parseInt(row.count, 10);
            return acc;
        }, {});

        // Default stats
        const defaultStats = {
            pending: stats.pending || 0,
            reject: stats.reject || 0,
            interview: stats.interview || 0,
        };

        // Fetch monthly application status
        const monthlyQuery = `
            SELECT EXTRACT(YEAR FROM created_at) AS year,
                   EXTRACT(MONTH FROM created_at) AS month,
                   COUNT(*) AS count
            FROM jobs
            WHERE created_by = $1
            AND status LIKE $2
            GROUP BY year, month
            ORDER BY year DESC, month DESC
        `;
        const monthlyParams = [userId, status];

        const monthlyResult = await db.query(monthlyQuery, monthlyParams);

        // Transform the monthly application statistics
        const monthlyApplication = monthlyResult.rows.map((item) => {
            const { year, month, count } = item;
            const date = moment()
                .month(month - 1)
                .year(year)
                .format("MMM Y");
            return { date, count: parseInt(count, 10) };
        });

        res.status(200).json({
            totalJobs: statsResult.rowCount,
            defaultStats,
            monthlyApplication,
        });
    } catch (error) {
        console.error('Error fetching job statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
*/
export const jobstatuscontroller = async (req, res, next) => {
    const userId = req.body.user.id;
    let { status } = req.query;

    // If status is not provided or is 'all', set it to a wildcard
    status = status && status !== 'all' ? status : '%';

    // Adjusting status variations
    const mappedStatus = {
        pend: 'pending',
        reject: 'rejected',
        interview: 'interview',
        // Add more mappings as needed
    };

    // Check if the status matches any of the mappings, otherwise use the wildcard
    const mappedStatusValue = mappedStatus[status] || '%';

    // Fetch job statistics grouped by status
    const statsQuery = `
        SELECT status, COUNT(*) AS count 
        FROM jobs 
        WHERE created_by = $1 
        AND (status LIKE $2 OR status = $3)
        GROUP BY status
    `;
    const statsParams = [userId, `%${status}%`, mappedStatusValue];

    try {
        const statsResult = await db.query(statsQuery, statsParams);

        // Transform stats into a dictionary using reduce
        const stats = statsResult.rows.reduce((acc, row) => {
            acc[row.status] = parseInt(row.count, 10);
            return acc;
        }, {});

        // Default stats
        const defaultStats = {
            pending: stats.pending || 0,
            rejected: stats.rejected || 0,
            interview: stats.interview || 0,
        };

        // Fetch monthly application status
        const monthlyQuery = `
            SELECT EXTRACT(YEAR FROM created_at) AS year,
                   EXTRACT(MONTH FROM created_at) AS month,
                   COUNT(*) AS count
            FROM jobs
            WHERE created_by = $1
            AND (status LIKE $2 OR status = $3)
            GROUP BY year, month
            ORDER BY year DESC, month DESC
        `;
        const monthlyParams = [userId, `%${status}%`, mappedStatusValue];

        const monthlyResult = await db.query(monthlyQuery, monthlyParams);

        // Transform the monthly application statistics
        const monthlyApplication = monthlyResult.rows.map((item) => {
            const { year, month, count } = item;
            const date = moment()
                .month(month - 1)
                .year(year)
                .format("MMM Y");
            return { date, count: parseInt(count, 10) };
        });

        res.status(200).json({
            totalJobs: statsResult.rowCount,
            defaultStats,
            monthlyApplication,
        });
    } catch (error) {
        console.error('Error fetching job statistics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

