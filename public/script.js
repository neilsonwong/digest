'use strict';

function SiteWindow(props) {
  return (
    <a href={props.webLink}>
      <div className='site-window'>
        <div className='site-title'>
          <h2>{props.name}</h2>
        </div>
        <div className='site-metadata'>
          <div className='site-description'>{props.description}</div>
          <div className='site-weblink'>{props.webLink}</div>
        </div>
        <div className='site-preview'><img src={props.preview} /></div>
        <SiteStatus status={props.status} />
      </div>
    </a>
  );
}

function SiteStatus(props) {
  if (props.status.Online !== undefined && props.status.Online === true){
    return <div className='site-online'>Online</div>;
  }
  else {
    return <div className='site-offline'>Offline</div>;
  }
}

class DigestPortal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sites: []
    };
  }

  componentDidMount() {
    this.fetchSiteData();
  }

  async fetchSiteData() {
    console.log('fetching site data');
    let data = await fetch('/applications').then(res => res.json());
    console.log(data);
    this.setState({'sites': data});
  }

  render() {
    if (this.state.sites.length > 0){
      let siteWindows = this.state.sites.map((site) => (
        <SiteWindow key={site.name} name={site.name} webLink={site.webLink} 
          preview={site.preview} description={site.description} status={site.states[0]} />
      ));
      return <div>{siteWindows}</div>;
    }
    return 'Nothing Here!';
  }
}

const domContainer = document.querySelector('#digest_portal');
ReactDOM.render(React.createElement(DigestPortal), domContainer);