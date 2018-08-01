namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PartIntPer1 : DbMigration
    {
        public override void Up()
        {
            DropColumn("CR.tab_PersonaPartInt", "Clave");
            DropColumn("CR.tab_PersonaPartInt", "Calle");
            DropColumn("CR.tab_PersonaPartInt", "Colonia");
            DropColumn("CR.tab_PersonaPartInt", "CP");
            DropColumn("CR.tab_PersonaPartInt", "Autor");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_PersonaPartInt", "Autor", c => c.String(nullable: false, maxLength: 250));
            AddColumn("CR.tab_PersonaPartInt", "CP", c => c.String(maxLength: 5));
            AddColumn("CR.tab_PersonaPartInt", "Colonia", c => c.String(maxLength: 250));
            AddColumn("CR.tab_PersonaPartInt", "Calle", c => c.String(maxLength: 250));
            AddColumn("CR.tab_PersonaPartInt", "Clave", c => c.Int(nullable: false));
        }
    }
}
