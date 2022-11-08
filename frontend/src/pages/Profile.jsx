import {FaUser} from  'react-icons/fa'


function Profile() {
    return (
        <>
            <section className="heading">
                <h1>
                    <FaUser /> Profile
                    <p>Your Qaucking so far</p>
                </h1>
            </section>
            <section className="answers">
                <div className="answears_list">
                    {/* TODO List of personal quacks from DB */}
                    <p>List of quacks</p>
                </div>
            </section>
        </>
    )
}

export default Profile