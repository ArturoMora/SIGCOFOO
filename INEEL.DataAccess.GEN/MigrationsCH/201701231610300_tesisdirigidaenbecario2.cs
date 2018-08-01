namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tesisdirigidaenbecario2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_TesisDirigida", "BecarioDirigidoId", c => c.Int());
            AlterColumn("CH.tab_BecarioDirigido", "TesisDirigidaId", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("CH.tab_BecarioDirigido", "TesisDirigidaId", c => c.Int(nullable: false));
            DropColumn("CH.tab_TesisDirigida", "BecarioDirigidoId");
        }
    }
}
