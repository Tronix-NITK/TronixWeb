function loginDirect() {
    const {pathname} = this.props.location;
    let app = window.location.protocol + "//" + window.location.host;
    // app += "/tronix";
    let s, f;
    s = pathname === "/login" ? "/" : pathname;
    f = "/restore/PLF/";
    s = encodeURIComponent(app + s);
    f = encodeURIComponent(app + f);
    window.location.href = `${this.server}/part/auth/login/google?s=${s}&f=${f}`;
}

const UserGroup = Object.freeze({
    SU: 15,
    ADMIN: 10,
    MODERATOR: 5,
    PARTICIPANT: 3,
    URP: 2,
    GENERIC: 1,
});

function isParticipant(user) {
    return (user && user.group === UserGroup.PARTICIPANT);
}

function isURP(user) {
    return (user && user.group === UserGroup.URP);
}

module.exports = {loginDirect, isParticipant, isURP};