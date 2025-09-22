import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import dateFormat from 'dateformat';
import React from 'react';

interface CertificateTemplateProps {
  volunteerName: string;
  opportunityTitle: string;
  orgLogo: string;
  orgRepresentativeName: string;
}

// Create Document Component
const CertificateTemplate: React.FC<CertificateTemplateProps> = ({
  volunteerName,
  opportunityTitle,
  orgLogo,
  orgRepresentativeName,
}) => {
  return (
    <Document>
      <Page size='A4' style={styles.page} orientation='landscape'>
        <View style={styles.container}>
          <Text style={styles.title}>Certificate of Appreciation</Text>

          <Text style={styles.content}>Proudly Presented to</Text>

          <Text style={styles.volunteerName}>{volunteerName}</Text>
          <Text style={styles.volunteerNameUnderline}></Text>

          <Text style={styles.description}>
            The volunteer served as a {opportunityTitle}. The certificate is
            awarded in recognition of their outstanding commitment and
            dedication in the field of community service. Their contributions
            have greatly impacted the community, making a positive difference in
            the lives of many.
          </Text>

          <Image
            src='https://akilconnect.org/assets/certificate/leaf_left.png'
            style={styles.leftFeather}
          ></Image>
          <Image
            src='https://akilconnect.org/assets/certificate/leaf_right.png'
            style={styles.rightFeather}
          ></Image>

          <View style={styles.mainFooter}>
            <Image src={orgLogo} style={styles.orgLogo} />

            <Image
              src='https://akilconnect.org/assets/certificate/ribbon.png'
              style={styles.ribbon}
            />

            <View style={styles.orgRepSection}>
              <Text
                style={{
                  fontFamily: 'Quintessential',
                  textTransform: 'capitalize',
                  fontWeight: 'bold',
                  marginLeft: 5,
                }}
              >
                {orgRepresentativeName}
              </Text>
              {/* <Text style={styles.orgRepresentativeUnderline}></Text> */}
            </View>
          </View>

          <Text style={styles.issuedOn}>
            Issued on {dateFormat(new Date(), 'mmm dd, yyyy')}
          </Text>
        </View>
        <Image
          src='https://akilconnect.org/assets/certificate/frame_top_left.png'
          style={styles.topLeft}
        />
        <Image
          src='https://akilconnect.org/assets/certificate/frame_top_right.png'
          style={styles.topRight}
        />
        <Image
          src='https://akilconnect.org/assets/certificate/frame_2.png'
          style={styles.bottomLeft}
        />
        <Image
          src='https://akilconnect.org/assets/certificate/frame_1.png'
          style={styles.bottomRight}
        />
      </Page>
    </Document>
  );
};

Font.register({
  family: 'Oswald',
  src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf',
});

Font.register({
  family: 'Quintessential',
  src: 'https://fonts.gstatic.com/s/quintessential/v4/mmk6ioesnTrEky_Zb92E5gd8ZphFIbDoTMp_nPGYQR4.ttf',
});

const styles = StyleSheet.create({
  page: {
    position: 'relative',
  },
  container: {
    border: 'solid 1mm #404472',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  orgLogo: {
    width: 100,
    height: 100,
  },

  ribbon: {
    width: 100,
    height: 100,
  },

  textBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 20,
  },

  leftFeather: {
    width: 100,
    height: '50%',
    position: 'absolute',
    left: 0,
    top: '30%',
  },
  rightFeather: {
    width: 100,
    height: '50%',
    position: 'absolute',
    right: 0,
    top: '30%',
  },

  topLeft: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: 0,
    left: 0,
  },
  topRight: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: 0,
    right: 0,
  },
  bottomLeft: {
    position: 'absolute',
    width: 100,
    height: 100,
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    position: 'absolute',
    width: 100,
    height: 100,
    bottom: 0,
    right: 0,
  },

  mainFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 30,
  },

  orgRepSection: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    textAlign: 'center',
    gap: 30,
  },

  title: {
    fontSize: 28,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 5,
    fontFamily: 'Oswald',
    color: '#7a4304',
    padding: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  content: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    letterSpacing: 5,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontFamily: 'Oswald',
  },

  volunteerNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    lineHeight: 80,
  },
  volunteerName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: -2,
    marginTop: 10,
    fontFamily: 'Quintessential',
    textTransform: 'capitalize',
  },
  volunteerNameUnderline: {
    borderBottom: '1px solid #7a4304',
    width: '80%',
    marginLeft: -5,
  },

  orgRepresentativeUnderline: {
    borderBottom: '1px solid #7a4304',
    width: '150%',
  },

  description: {
    fontSize: 16,
    textAlign: 'justify',
    lineHeight: 1.5,
    marginHorizontal: 80,
    marginTop: 20,
    marginBottom: 40,
    fontFamily: 'Times-Roman',
  },
  issuedOn: {
    fontSize: 14,
    textAlign: 'left',
    marginLeft: 10,
    marginBottom: 10,
    marginTop: 40,
    fontFamily: 'Quintessential',
  },
});

export default CertificateTemplate;
