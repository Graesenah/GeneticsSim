
package gen.sim.geneticssim.service;

import gen.sim.geneticssim.data.DynastyDao;
import gen.sim.geneticssim.entities.Dynasty;
import gen.sim.geneticssim.entities.Member;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DynastyService {

    @Autowired
    DynastyDao dd;
    
    @Autowired
    MemberService ms;
    
    public DynastyService() {
    }
    
    public void addNewDynasty(Dynasty dynasty) {
        dd.addDynasty(dynasty);
        
        dynasty.getFounder().setPrimaryDynasty(dynasty);
        dynasty.setFounder(ms.addFounder(dynasty.getFounder()));
        dynasty.addMember(dynasty.getFounder());
        dynasty.addPrimaryMember(dynasty.getFounder());
        dynasty.getFounder().setPrimaryDynasty(dynasty);
    }

    public List<Dynasty> getAllDynasties() {
        return dd.getAllDynasties();
    }
    
    public List<Dynasty> getSearchDynasties(String search) {
        return dd.getSearchDynasties(search);
    }

    public Dynasty getDynastyByName(String dynName) {
        Dynasty dynasty = dd.getDynastyByName(dynName);
        ms.populateMembersForDynastyDisplay(dynasty);
        return dynasty;
    }

    private Member populateChildrenPrimaryDynasty(Member m, String dynName, Dynasty dyn) {
        List<Member> children = new ArrayList();
        for(Member c : m.getChildren()) {
            if(c.getPrimaryDynasty().getName().equals(dynName)) {
                dyn = new Dynasty();
                dyn.setName(dynName);
                c.setPrimaryDynasty(dyn);
                c = ms.getSpouseInfo(c);
            }
            else {
                c.setPrimaryDynasty(dd.getPrimaryDynastyInfo(c.getPrimaryDynasty().getName()));
            }
            children.add(c);
        }    
        m.setChildren(children);
        return m;
    }
}
