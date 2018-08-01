namespace INEEL.DataAccess.GEN.MigrationsMT
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class deleteFKinEvaluaciones2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("MT.ITFEvaluaciones", "IdInformeTecnicoFinal", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("MT.ITFEvaluaciones", "IdInformeTecnicoFinal", c => c.String(nullable: false, maxLength: 10));
        }
    }
}
