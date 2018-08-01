namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tesisdirigidaenbecario : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_BecarioDirigido", "TesisDirigidaId", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("CH.tab_BecarioDirigido", "TesisDirigidaId");
        }
    }
}
