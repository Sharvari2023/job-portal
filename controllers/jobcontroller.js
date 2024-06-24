import db from "../config/db.js";
export const jobcontroller = async (req, res, next) => {
    const { company, position } = req.body;
    if (!company || !position) {
        next("please provide all fields");
    }
    const createdBy = req.user.id;
    console.log(createdBy, 'creadted by id')
    const result = await db.query(
        `INSERT INTO jobs (company, position, created_by)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [company, position, createdBy]
    );

    // Log the created job's ID
    console.log(result.rows[0].job_id);

    // Send a successful response
    res.status(201).json({ message: "Job created successfully", job: result.rows[0] });
}
//----get jobs----
export const getalljobcontroller = async (req, res, next) => {
    const jobs = await db.query("SELECT * FROM jobs WHERE created_by=$1", [req.user.id])
    res.status(200).json({
        totaljobs: jobs.length,
        jobs
    })
}

//---update jobs----
export const updatejobcontroller = async (req, res, next) => {

    const { company, position } = req.body
    if (!company || !position) {
        next('provide all required parameters')
    }
    const job = await db.query("SELECT * FROM jobs WHERE created_by=$1 ", [req.user.id]);
    if (job.rows.length === 0) {
        next('no job found with this id')
    }
    const jobresult = job.rows[0];
    if (req.user.id != String(jobresult.created_by)) {
        next('you are not authorised to perform this operation')
        return;

    }
    const updatejob = await db.query("UPDATE jobs SET company = $1, position = $2 WHERE created_by = $3 RETURNING *",
        [company, position, req.user.id])
    res.status(200).json({ updatejob })

}