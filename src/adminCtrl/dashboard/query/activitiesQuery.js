const activitiesQueries = {
    showActivities :`SELECT * FROM (
  SELECT * FROM activities
  ORDER BY Activity_ID DESC
  LIMIT 5
) AS lastFive
ORDER BY Activity_ID DESC;
`,
    showAllActivities :`SELECT * FROM (
  SELECT * FROM activities
  ORDER BY Activity_ID DESC
  LIMIT ? OFFSET ?
) AS lastFive
ORDER BY Activity_ID DESC
`,
}
module.exports= {
    activitiesQueries
}
