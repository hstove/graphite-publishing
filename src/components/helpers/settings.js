import {
  getFile,
  putFile
} from "blockstack";
import { getMonthDayYear } from './timestamp';

export function loadDomain() {
  getFile("newDomain.json", {decrypt: true})
    .then((fileContents) => {
      if(fileContents) {
        this.setState({newDomain: JSON.parse(fileContents || '{}')});
        setTimeout(this.accountDetails, 300)
      } else {
        this.setState({newDomain: ""});
        setTimeout(this.accountDetails, 300)
      }
    })
    .catch(error => {
      console.log(error);
    })
}

export function handleNewDomain(e) {
  this.setState({ editing: true, newDomain: e.target.value });
}

export function accountDetails() {
  if(this.state.checking === false) {
    const object = {};
    if(this.state.newAccountName !== "") {
      object.accountName = this.state.newAccountName;
    } else {
      object.accountName = this.state.accountName;
    }
    object.ownerEmail = this.state.ownerEmail;
    object.ownerBlockstackId = this.state.ownerBlockstackId;
    object.accountId = this.state.accountId;
    object.signUpDate = this.state.signUpDate;
    object.paymentDue = this.state.paymentDue;
    object.onboardingComplete = this.state.onboardingComplete;
    object.accountType = this.state.accountType;
    object.trialPeriod = this.state.trialPeriod;
    object.logo = this.state.logo;
    object.newDomain = this.state.newDomain;
    object.team = this.state.team;
    object.integrations = this.state.integrations;
    object.lastUpdated = getMonthDayYear();
    this.setState({accountDetails: object});
    setTimeout(this.saveAccount, 300)
  } else {
    setTimeout(this.accountDetails, 1000);
  }
}

export function saveAccount() {
  this.setState({ newTeammateId: "", newTeammateName: "", newTeammateEmail: "", newTeammateRole: "" })
  let fileName = 'account.json';
  let saveObject = JSON.stringify(this.state.accountDetails);
  let encryptionObject = {encrypt: true};
  putFile(fileName, saveObject, encryptionObject)
    .then(() => {
      this.saveToTeam();
    })
    .catch(error => {
      console.log(error)
    })
}

export function handleDrop(files) {
  this.setState({ editing: true });
  var file = files[0]
  const reader = new FileReader();
  reader.onload = (event) => {
     const object = {};
     object.file = file;
     object.link = event.target.result;
     object.name = file.name;
     object.size = file.size;
     object.type = file.type;
     if(object.size > 111048576) {
       this.handleDropRejected();
       console.log("file too large")
     }else {
       this.setState({logo: object.link});
       this.setState({ loading: "", show: "hide"})
       setTimeout(this.accountDetails, 300)
     }
   };
   reader.readAsDataURL(file);
}

export function saveLogo() {
  putFile("logo.json", JSON.stringify(this.state.logo), {encrypt:true})
    .then(() => {
      this.accountDetails();
    })
    .catch(e => {
      console.log("e");
      console.log(e);
    });
}

export function removeLogo() {
  this.setState({ editing: true, logo: "" });
  setTimeout(this.accountDetails, 300);
}

export function clearDomainName() {
  this.setState({ editing: false, newDomain: "" });
}

export function removeDomain() {
  this.setState({ editing: true });
  putFile("newDomain.json", JSON.stringify(""), {encrypt: true})
    .then(() => {
      this.loadDomain();
    })
    .catch(error => {
      console.log(error);
    })
}

export function newAccountName(e) {
  this.setState({ editing: true, newAccountName: e.target.value});
}

export function clearAccountName() {
  this.setState({ editing: false, newAccountName: "" });
}
