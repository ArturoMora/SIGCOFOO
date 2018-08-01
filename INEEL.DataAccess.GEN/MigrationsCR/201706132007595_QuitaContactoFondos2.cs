namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class QuitaContactoFondos2 : DbMigration
    {
        public override void Up()
        {
            DropColumn("CR.tab_FondoPrograma", "ContactoId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_FondoPrograma", "ContactoId", c => c.Int());
        }
    }
}
