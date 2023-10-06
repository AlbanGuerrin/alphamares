import React, { useEffect, useState } from "react";
import { Page, Text, Document, StyleSheet, View, Font } from "@react-pdf/renderer";
import moment from "moment";
import axios from "axios";
import details from './../../assets/details.json';

Font.register({ family: "Roboto", src: "https://fonts.googleapis.com/css?family=Roboto" });


const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 20,
  },
  h1: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 5,
  },
  h2: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    display: 'flex',
    alignSelf: 'flex-end',
    marginBottom: '20px'
  },
  left: {
    flex: 1,
    lineHeight: '1.6px',
    fontSize: 10,
  },
  right: {
    display: 'flex',
    alignSelf: 'flex-end',
    lineHeight: '1.6px',
    fontSize: 10,
  },
  rightContainer: {
    marginTop: '50px',
  },
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 10,
    textDecoration: 'underline',
    marginBottom: '5px'
  },
  text: {
    fontSize: 10,
    lineHeight: '1.3px',
    textAlign: "justify",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 10,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
  table: {
    display: 'table',
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 4,
    borderWidth: 1,
    borderColor: '#000',
    fontSize: 10,
    textAlign: "center",
  },
  tableHeader: {
    backgroundColor: '#f2f2f2',
    fontFamily: "Helvetica-Bold",
  },
  tableTotal: {
    marginTop: 10,
  },
  info: {
    marginTop: '25px'
  }
})

// export default function BillingFile(props) {
//   const user = props.user;

//   return(
//     <div>
//       {user.language == "French" ? 
//       <BillingFileFR sale={props.sale} user={user} auction={props.auction}/> 
//       : <BillingFileEN sale={props.sale} user={user} auction={props.auction}/> 
//       }
//     </div>
//   )
// };


export function BillingFileFR(props) {
  const sale = props.sale;
  const user = props.user;
  const auction = props.auction;
  const lot = sale.lot;
  const bid = sale.bid;

  const amount = (bid.amount);
  const amountWithTVA = (bid.amount * 1.2);
  const fees = (amountWithTVA * 0.1);
  const feesWithTVA = (fees * 1.2);
  const total = (amountWithTVA + feesWithTVA);

  const [numberOfBill, setNumberOfBill] = useState();

  function Header() {
    return (
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.h1}>Facture émise par la société :</Text>
          <Text>ALPHA MARES SARL</Text>
          <Text>La Pouprière 61250 SEMALLE - FRANCE</Text>
          <Text>contact@alphamares.com</Text>
          <Text>+33 6 33 34 66 54 </Text>
          <Text>SIRET : 95076126200019</Text>
          <Text>N° de TVA : FR59950761262</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.h2}>Facture</Text>
          <View style={styles.rightContainer}>
            <Text style={styles.right}>{user.type === 'Company' ? user.companyName : user.name + " "+user.surname}</Text>
            <Text style={styles.right}>{user.adress}</Text>
            <Text style={styles.right}>{user.adressCity}</Text>
            <Text style={styles.right}>{user.phoneNumber}</Text>
            <Text style={styles.right}>{user.email}</Text>
            <Text style={styles.right}>{user.type !== 'Private' ? "N° de TVA : " + user.tvaNumber : ""}</Text>
          </View>
        </View>
      </View>
    )
  }

  async function getNumberBill() {
    axios.get(`${process.env.REACT_APP_API_URL}api/sales/num-sales/${sale._id}`)
      .then((res) => {
        const data = res.data;
        if (data !== numberOfBill) {
          setNumberOfBill(data);
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getNumberBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, numberOfBill])

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Header />
        <br />
        <Text style={styles.text}><>Fait à ALENÇON, le {moment().format('L')}</></Text>
        <br />
        <Text style={styles.text}>N° de Facture : {moment(sale.updatedAt).format('L').replace(/\//g, '') + numberOfBill}</Text>
        <Text style={styles.text}>Nom de la vente : {auction.title}</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 1 }]}>N° de Lot</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Nom du Lot</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Montant (en €)</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>TVA (en %)</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Prix TTC (en €)</Text>
          </View>
          {/* {invoice.items.map(item => ( */}
          <View key={lot._id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{lot.number}</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{lot.title}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{amount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>20</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{amountWithTVA.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
          <View key={lot._id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>-</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Frais de vente (10 %)</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{fees.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>20</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{feesWithTVA.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
          {/* ))} */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { flex: 2, paddingHorizontal: 2.4 }]}>Total HT (en €)</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{(amount + fees).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { flex: 2, paddingHorizontal: 2.4 }]}>Total frais de TVA (en €)</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{((amount + fees) * 0.2).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { flex: 2, paddingHorizontal: 2.4 }]}>Total TTC (en €)</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{total.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
          <View style={[styles.table, { width: '40%' }]}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader, { flex: 2 }]}>Moyen de paiement </Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>Virement bancaire</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader, { flex: 2 }]}>A payer</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>A la réception de la facture</Text>
            </View>
          </View>

          <View style={[styles.table, { width: '50%' }]}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '100%', textAlign: "center" }]}>Récapitulatif TVA</Text>
            </View>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 1 }]}>Taux</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Base HT</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>TVA</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>TTC</Text>
            </View>
            <View style={[styles.tableRow]}>
              <Text style={[styles.tableCell, { flex: 1 }]}>20 %</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{(amount + fees).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{((amount + fees) * 0.2).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{total.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
            </View>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={[styles.title, styles.bold]}>Coordonnées bancaires : </Text>
          <Text style={styles.text}><Text style={styles.bold}>Titulaire du compte :</Text> ALPHA MARES</Text>
          <Text style={styles.text}><Text style={styles.bold}>IBAN : </Text>{details.IBAN}</Text>
          <Text style={styles.text}><Text style={styles.bold}>BIC : </Text> {details.BIC}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Domiciliation :</Text> Crédit Agricole</Text>
          <Text style={styles.text}><Text style={styles.bold}>Adresse :</Text> 15 Cours Clemenceau 61000 Alençon</Text>
        </View>

        <View style={{ marginTop: '10px' }}>
          <Text style={[styles.title, styles.bold]}>Rappel des règles de paiement : </Text>
          <Text style={styles.text}>  •	Vous devez faire ce virement en euros.</Text>
          <Text style={styles.text}>  •	Le paiement doit être réalisé en une seule fois.</Text>
          <Text style={styles.text}>  •	Vous êtes redevable de l'ensemble des frais, taxes, droits et prélèvements dus au titre de ce paiement.</Text>
          <Text style={styles.text}>  •	En cas d'absence de paiement intégral dans le délai de 7 jours à compter de la clôture de la vente et de la réception de la facture par l'acheteur, ALPHA MARES est libre d'annuler la vente ou d'appliquer des intérêts de retard au taux en vigueur.</Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}

export default function BillingFileEN(props) {
  const sale = props.sale;
  const user = props.user;
  const auction = props.auction;
  const lot = sale.lot;
  const bid = sale.bid;


  const amount = (bid.amount);
  const amountWithTVA = (bid.amount * 1.2);
  const fees = (amountWithTVA * 0.1);
  const feesWithTVA = (fees * 1.2);
  const total = (amountWithTVA + feesWithTVA);

  const [numberOfBill, setNumberOfBill] = useState();

  function Header() {
    return (
      <View style={styles.container}>
        <View style={styles.left}>
          <Text style={styles.h1}>Invoice issued by the compagny: </Text>
          <Text>ALPHA MARES SARL</Text>
          <Text>La Pouprière 61250 SEMALLE - FRANCE</Text>
          <Text>contact@alphamares.com</Text>
          <Text>+33 6 33 34 66 54 </Text>
          <Text>SIRET : 95076126200019</Text>
          <Text>VAT number : FR59950761262</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.h2}>Invoice</Text>
          <View style={styles.rightContainer}>
            <Text style={styles.right}>{user.name} {user.surname}</Text>
            <Text style={styles.right}>{user.adress}</Text>
            <Text style={styles.right}>{user.adressCity}</Text>
            <Text style={styles.right}>{user.phoneNumber}</Text>
            <Text style={styles.right}>{user.email}</Text>
            <Text style={styles.right}>{user.tvaNumber !== undefined ? "VAT number : " + user.tvaNumber : ""}</Text>
          </View>
        </View>
      </View>
    )
  }

  async function getNumberBill() {
    axios.get(`${process.env.REACT_APP_API_URL}api/sales/num-sales/${sale._id}`)
      .then((res) => {
        const data = res.data;
        if (data !== numberOfBill) {
          setNumberOfBill(data);
        }
      })
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getNumberBill();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, numberOfBill])

  return (
    <Document>
      <Page size="A4" style={styles.body}>
        <Header />
        <br />
        <Text style={styles.text}><>ALENÇON, {moment().format('L')}</></Text>
        <br />
        <Text style={styles.text}>Invoice number : {moment(sale.updatedAt).format('L').replace(/\//g, '') + numberOfBill}</Text>
        <Text style={styles.text}>Name of the event : {auction.title}</Text>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Lot Number</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Name</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Amount ( €)</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>VAT (%)</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>Including VAT (en €)</Text>
          </View>
          {/* {invoice.items.map(item => ( */}
          <View key={lot._id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>{lot.number}</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{lot.title}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{amount.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>20</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{amountWithTVA.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
          <View key={lot._id} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>-</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>Selling fees (10 %)</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{fees.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>20</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{feesWithTVA.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
          {/* ))} */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { flex: 2, paddingHorizontal: 2.4 }]}>Total amount excluding VAT (€)</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{(amount + fees).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { flex: 2, paddingHorizontal: 2.4 }]}>VAT amount (€)</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{((amount + fees) * 0.2).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.tableHeader, { flex: 2, paddingHorizontal: 2.4 }]}>Total amount including VAT (€)</Text>
            <Text style={[styles.tableCell, { flex: 3 }]}>{total.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
          </View>
        </View>

        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "space-between" }}>
          <View style={[styles.table, { width: '40%' }]}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader, { flex: 2 }]}>Method of payement </Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>Bank transfer</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.tableHeader, { flex: 2 }]}>To be paid</Text>
              <Text style={[styles.tableCell, { flex: 3 }]}>Upon receipt</Text>
            </View>
          </View>

          <View style={[styles.table, { width: '50%' }]}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { width: '100%', textAlign: "center" }]}>VAT summary</Text>
            </View>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, { flex: 1 }]}>Rate</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Excl. VAT</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>VAT</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>Incl. VAT</Text>
            </View>
            <View style={[styles.tableRow]}>
              <Text style={[styles.tableCell, { flex: 1 }]}>20 %</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{(amount + fees).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{((amount + fees) * 0.2).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{total.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Text>
            </View>
          </View>
        </View>

        <View>
          <Text style={[styles.title, styles.bold]}>Bank details : </Text>
          <Text style={styles.text}><Text style={styles.bold}>Account holder :</Text> ALPHA MARES</Text>
          <Text style={styles.text}><Text style={styles.bold}>IBAN : </Text>{details.IBAN}</Text>
          <Text style={styles.text}><Text style={styles.bold}>BIC : </Text>{details.BIC}</Text>
          <Text style={styles.text}><Text style={styles.bold}>Bank agency :</Text> Crédit Agricole</Text>
          <Text style={styles.text}><Text style={styles.bold}>Adress :</Text> 15 Cours Clemenceau 61000 Alençon</Text>
        </View>

        <View style={{ marginTop: '10px' }}>
          <Text style={[styles.title, styles.bold]}>Payement rules :</Text>
          <Text style={styles.text}>  •	You must make this transfer in euros.</Text>
          <Text style={styles.text}>  •	The payment must be made in a single transfer.</Text>
          <Text style={styles.text}>  •	You are liable for all charges, taxes, duties and levies due in respect of this payment.</Text>
          <Text style={styles.text}>  •	In the event of absence of full payment within 7 days from the closing of the sale and receipt of the invoice by the buyer, ALPHA MARES is free to cancel the sale or to apply interests for late payment at the current rate.</Text>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
}