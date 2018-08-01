namespace INEEL.DataAccess.GEN.MigrationsCR
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class PartIntPer2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("CR.tab_PersonaPartInt", "EstadoId", "GEN.cat_Estados");
            DropIndex("CR.tab_PersonaPartInt", new[] { "EstadoId" });
            DropColumn("CR.tab_PersonaPartInt", "EstadoId");
        }
        
        public override void Down()
        {
            AddColumn("CR.tab_PersonaPartInt", "EstadoId", c => c.Int());
            CreateIndex("CR.tab_PersonaPartInt", "EstadoId");
            AddForeignKey("CR.tab_PersonaPartInt", "EstadoId", "GEN.cat_Estados", "EstadoId");
        }
    }
}
