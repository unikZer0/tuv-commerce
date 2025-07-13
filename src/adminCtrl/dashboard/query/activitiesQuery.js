const activitiesQueries = {
    showActivities :`SELECT a.*, r.Role_Name
FROM (
  SELECT * FROM activities
  ORDER BY Activity_ID DESC
  LIMIT 5
) AS a
JOIN users u ON a.User_ID = u.User_ID
JOIN roles r ON u.Role_ID = r.Role_ID
ORDER BY a.Activity_ID DESC;
`,
    showAllActivities :`SELECT a.*, r.Role_Name
FROM (
  SELECT * FROM activities
  ORDER BY Activity_ID DESC
  LIMIT ? OFFSET ?
) AS a
JOIN users u ON a.User_ID = u.User_ID
JOIN roles r ON u.Role_ID = r.Role_ID
ORDER BY a.Activity_ID DESC;
`,
}
module.exports= {
    activitiesQueries
}
