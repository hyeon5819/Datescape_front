async function Report(type, comment_id) {
    window.open(location.origin + `/templates/report.html?type=${type}&id=${comment_id}&/`, "Child", "width=1300, height=1000, top=50, left=50")
}
