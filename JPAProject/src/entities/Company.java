package entities;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

@Entity
public class Company {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	private String name;
	
	@OneToOne
	@JoinColumn(name="owner_id")
	private User owner;
	
	@OneToMany(mappedBy="owner")
	private List<User> users;
	
	@OneToMany(mappedBy="company")
	private List<Location> locations;
	
	@OneToOne(mappedBy="address")
	private Address address;
	
	@ManyToOne
	@JoinColumn(name="type_id")
	private Type	type;
	
	@Column(name="store_url")
	private String storeUrl;
	
	@Column(name="chain_bool")
	private Boolean isChain;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
	}

	public Type getType() {
		return type;
	}

	public void setType(Type type) {
		this.type = type;
	}

	public String getStoreUrl() {
		return storeUrl;
	}

	public void setStoreUrl(String storeUrl) {
		this.storeUrl = storeUrl;
	}

	public Boolean getIsChain() {
		return isChain;
	}

	public void setIsChain(Boolean isChain) {
		this.isChain = isChain;
	}

	public int getId() {
		return id;
	}

	@Override
	public String toString() {
		return "Company [id=" + id + ", name=" + name + ", owner=" + owner + ", type=" + type + ", storeUrl=" + storeUrl
				+ ", isChain=" + isChain + "]";
	}
	
	
	
	

}
