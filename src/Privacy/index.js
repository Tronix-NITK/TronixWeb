import React, {Component} from "react";
import * as PropTypes from "prop-types";
import {withStyles} from "@material-ui/core";
import AppContext from "../AppContext";
import Paper from "@material-ui/core/Paper";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";

const styles = theme => ({
    paper: {
        ...theme.styles.translucentPaperContainer,
    }
});


class Privacy extends Component {
    render() {
        const {classes} = this.props;
        return (
            <Container>
                <Paper className={classes.paper}>
                    <Typography paragraph variant="h1">Privacy Policy</Typography>


                    <Typography paragraph>Effective date: October 11, 2019</Typography>


                    <Typography paragraph>Tronix ("us", "we", or "our") operates the https://www.tronixnitk.in/ website
                        (hereinafter
                        referred to as the "Service").</Typography>

                    <Typography paragraph>This page informs you of our policies regarding the collection, use, and
                        disclosure of personal
                        data when you use our Service and the choices you have associated with that data. Our Privacy
                        Policy for Tronix is created with the help of the <Link
                            href="https://www.privacypolicies.com/free-privacy-policy-generator/">PrivacyPolicies.com
                            Privacy Policy Generator</Link>.</Typography>

                    <Typography paragraph>We use your data to provide and improve the Service. By using the Service, you
                        agree to the
                        collection and use of information in accordance with this policy. Unless otherwise defined in
                        this Privacy Policy, the terms used in this Privacy Policy have the same meanings as in our
                        Terms and Conditions, accessible from https://www.tronixnitk.in/</Typography>


                    <Typography paragraph variant="h4">Information Collection And Use</Typography>

                    <Typography paragraph>We collect several different types of information for various purposes to
                        provide and improve our
                        Service to you.</Typography>

                    <h3>Types of Data Collected</h3>

                    <h4>Personal Data</h4>

                    <Typography paragraph>While using our Service, we may ask you to provide us with certain personally
                        identifiable
                        information that can be used to contact or identify you ("Personal Data"). Personally
                        identifiable information may include, but is not limited to:</Typography>

                    <ul>
                        <li>Email address</li>
                        <li>First name and last name</li>
                        <li>Phone number</li>
                        <li>Cookies and Usage Data</li>
                    </ul>

                    <h4>Usage Data</h4>

                    <Typography paragraph>We may also collect information on how the Service is accessed and used
                        ("Usage Data"). This
                        Usage Data may include information such as your computer's Internet Protocol address (e.g. IP
                        address), browser type, browser version, the pages of our Service that you visit, the time and
                        date of your visit, the time spent on those pages, unique device identifiers and other
                        diagnostic data.</Typography>

                    <h4>Tracking & Cookies Data</h4>
                    <Typography paragraph>We use cookies and similar tracking technologies to track the activity on our
                        Service and hold
                        certain information.</Typography>
                    <Typography paragraph>Cookies are files with small amount of data which may include an anonymous
                        unique identifier.
                        Cookies are sent to your browser from a website and stored on your device. Tracking technologies
                        also used are beacons, tags, and scripts to collect and track information and to improve and
                        analyze our Service.</Typography>
                    <Typography paragraph>You can instruct your browser to refuse all cookies or to indicate when a
                        cookie is being sent.
                        However, if you do not accept cookies, you may not be able to use some portions of our Service.
                        You can learn more how to manage cookies in the <Link
                            href="https://privacypolicies.com/blog/how-to-delete-cookies/">Browser Cookies Guide</Link>.
                    </Typography>
                    <Typography paragraph>Examples of Cookies we use:</Typography>
                    <ul>
                        <li><strong>Session Cookies.</strong> We use Session Cookies to operate our Service.</li>
                        <li><strong>Preference Cookies.</strong> We use Preference Cookies to remember your preferences
                            and various settings.
                        </li>
                        <li><strong>Security Cookies.</strong> We use Security Cookies for security purposes.</li>
                    </ul>

                    <Typography paragraph variant="h4">Use of Data</Typography>

                    <Typography paragraph>Tronix uses the collected data for various purposes:</Typography>
                    <ul>
                        <li>To provide and maintain the Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To allow you to participate in interactive features of our Service when you choose to do
                            so
                        </li>
                        <li>To provide customer care and support</li>
                        <li>To provide analysis or valuable information so that we can improve the Service</li>
                        <li>To monitor the usage of the Service</li>
                        <li>To detect, prevent and address technical issues</li>
                    </ul>

                    <Typography paragraph variant="h4">Transfer Of Data</Typography>
                    <Typography paragraph>Your information, including Personal Data, may be transferred to — and
                        maintained on — computers
                        located outside of your state, province, country or other governmental jurisdiction where the
                        data protection laws may differ than those from your jurisdiction.</Typography>
                    <Typography paragraph>If you are located outside India and choose to provide information to us,
                        please note that we
                        transfer the data, including Personal Data, to India and process it there.</Typography>
                    <Typography paragraph>Your consent to this Privacy Policy followed by your submission of such
                        information represents
                        your agreement to that transfer.</Typography>
                    <Typography paragraph>Tronix will take all steps reasonably necessary to ensure that your data is
                        treated securely and
                        in accordance with this Privacy Policy and no transfer of your Personal Data will take place to
                        an organization or a country unless there are adequate controls in place including the security
                        of your data and other personal information.</Typography>

                    <Typography paragraph variant="h4">Disclosure Of Data</Typography>

                    <h3>Legal Requirements</h3>
                    <Typography paragraph>Tronix may disclose your Personal Data in the good faith belief that such
                        action is necessary
                        to:</Typography>
                    <ul>
                        <li>To comply with a legal obligation</li>
                        <li>To protect and defend the rights or property of Tronix</li>
                        <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
                        <li>To protect the personal safety of users of the Service or the public</li>
                        <li>To protect against legal liability</li>
                    </ul>

                    <Typography paragraph variant="h4">Security Of Data</Typography>
                    <Typography paragraph>The security of your data is important to us, but remember that no method of
                        transmission over
                        the Internet, or method of electronic storage is 100% secure. While we strive to use
                        commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute
                        security.</Typography>

                    <Typography paragraph variant="h4">Service Providers</Typography>
                    <Typography paragraph>We may employ third party companies and individuals to facilitate our Service
                        ("Service
                        Providers"), to provide the Service on our behalf, to perform Service-related services or to
                        assist us in analyzing how our Service is used.</Typography>
                    <Typography paragraph>These third parties have access to your Personal Data only to perform these
                        tasks on our behalf
                        and are obligated not to disclose or use it for any other purpose.</Typography>


                    <Typography paragraph variant="h4">Links To Other Sites</Typography>
                    <Typography paragraph>Our Service may contain links to other sites that are not operated by us. If
                        you click on a third
                        party link, you will be directed to that third party's site. We strongly advise you to review
                        the Privacy Policy of every site you visit.</Typography>
                    <Typography paragraph>We have no control over and assume no responsibility for the content, privacy
                        policies or
                        practices of any third party sites or services.</Typography>


                    <Typography paragraph variant="h4">Children's Privacy</Typography>
                    <Typography paragraph>Our Service does not address anyone under the age of 18
                        ("Children").</Typography>
                    <Typography paragraph>We do not knowingly collect personally identifiable information from anyone
                        under the age of 18.
                        If you are a parent or guardian and you are aware that your Children has provided us with
                        Personal Data, please contact us. If we become aware that we have collected Personal Data from
                        children without verification of parental consent, we take steps to remove that information from
                        our servers.</Typography>


                    <Typography paragraph variant="h4">Changes To This Privacy Policy</Typography>
                    <Typography paragraph>We may update our Privacy Policy from time to time. We will notify you of any
                        changes by posting
                        the new Privacy Policy on this page.</Typography>
                    <Typography paragraph>We will let you know via email and/or a prominent notice on our Service, prior
                        to the change
                        becoming effective and update the "effective date" at the top of this Privacy
                        Policy.</Typography>
                    <Typography paragraph>You are advised to review this Privacy Policy periodically for any changes.
                        Changes to this
                        Privacy Policy are effective when they are posted on this page.</Typography>


                    <Typography paragraph variant="h4">Contact Us</Typography>
                    <Typography paragraph>If you have any questions about this Privacy Policy, please contact
                        us:</Typography>
                    <ul>
                        <li>By email: tronix@nitk.edu.in</li>

                    </ul>
                </Paper>
            </Container>
        );
    }
}

Privacy.propTypes = {
    classes: PropTypes.object.isRequired,
};
Privacy.contextType = AppContext;
export default withStyles(styles, {withTheme: true})(Privacy);