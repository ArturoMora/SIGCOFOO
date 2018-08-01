namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class migraExtractoProf : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "CH.tab_ExtractoProfesional",
                c => new
                    {
                        ClaveEmpleado = c.String(nullable: false, maxLength: 128),
                        Extracto = c.String(nullable: false),
                    })
                .PrimaryKey(t => t.ClaveEmpleado);
            
        }
        
        public override void Down()
        {
            DropTable("CH.tab_ExtractoProfesional");
        }
    }
}
