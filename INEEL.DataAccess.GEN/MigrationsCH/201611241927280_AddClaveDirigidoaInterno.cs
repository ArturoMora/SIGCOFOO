namespace INEEL.DataAccess.GEN.MigrationsCH
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddClaveDirigidoaInterno : DbMigration
    {
        public override void Up()
        {
            AddColumn("CH.tab_BecarioInterno", "BecarioDirigidoId", c => c.Int());
            CreateIndex("CH.tab_BecarioInterno", "BecarioDirigidoId");
            AddForeignKey("CH.tab_BecarioInterno", "BecarioDirigidoId", "CH.tab_BecarioDirigido", "BecarioDirigidoId");
        }
        
        public override void Down()
        {
            DropForeignKey("CH.tab_BecarioInterno", "BecarioDirigidoId", "CH.tab_BecarioDirigido");
            DropIndex("CH.tab_BecarioInterno", new[] { "BecarioDirigidoId" });
            DropColumn("CH.tab_BecarioInterno", "BecarioDirigidoId");
        }
    }
}
