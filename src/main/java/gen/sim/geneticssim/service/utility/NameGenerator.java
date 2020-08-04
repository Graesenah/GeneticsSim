
package gen.sim.geneticssim.service.utility;

import gen.sim.geneticssim.entities.Member;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;
import java.util.stream.Collectors;

public class NameGenerator {
    private static List<MemberName> names = new ArrayList();
    
    public static String generateName(Member member) {
        String name;
        if(member.getTraits().get("Sex").getValue().equals("Male")) {
            name = generateMaleName();
        }
        else {
            name = generateFemaleName();
        }
            return name;
    }
    
    public static void populateNames() {
        try {
            Scanner s = new Scanner(new BufferedReader(new FileReader("names.txt")));
            while (s.hasNextLine()) {
                String currentLine = s.nextLine();
                String[] tokens = currentLine.split(",");
                String name = tokens[1].substring(1, tokens[1].length()-1);
                boolean boy = false;
                if(tokens[3].equals("\"boy\"")) {
                    boy = true;
                }
                MemberName mn = new MemberName(name, boy);
                names.add(mn);
            }
        } catch(IOException e) {
            System.out.println("File Not Found");
        }
    }

    public static String generateMaleName() {
        List<MemberName> boyNames = names.stream()
                .filter(n -> n.isBoy())
                .collect(Collectors.toList());
        Random r = new Random();
        return boyNames.get(r.nextInt(boyNames.size())).getName();
    }

    public static String generateFemaleName() {
        List<MemberName> girlNames = names.stream()
                .filter(n -> !n.isBoy())
                .collect(Collectors.toList());
        Random r = new Random();
        return girlNames.get(r.nextInt(girlNames.size())).getName();
    }
    
    private static class MemberName {
        private String name;
        private boolean boy;

        public MemberName(String name, boolean boy) {
            this.name = name;
            this.boy = boy;
        }

        public String getName() {
            return name;
        }

        public boolean isBoy() {
            return boy;
        }
    }
}
